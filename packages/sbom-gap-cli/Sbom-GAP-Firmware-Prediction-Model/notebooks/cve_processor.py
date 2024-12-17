#!/usr/bin/env python3

import os
import sys
import json
import gzip
import shutil
import requests
import psycopg2
from packaging.version import Version, InvalidVersion
import argparse

# PostgreSQL database connection details
DB_CONFIG = {
    "dbname": "cve_database",
    "user": "postgres",
    "password": "change_me",
    "host": "localhost",
    "port": 5432
}

BASE_DIR = "../data/CVEs"


# === CODE BLOCK 1: Download and Extract CVE Data ===
def download_and_extract_cve_data(start_year=2002, end_year=2024, base_url="https://nvd.nist.gov/feeds/json/cve/1.1/"):
    # List of extra links that don't match the yearly structure
    extra_links = [
        {"name": "recent", "url": f"{base_url}nvdcve-1.1-recent.json.zip"},
        {"name": "modified", "url": f"{base_url}nvdcve-1.1-modified.json.zip"}
    ]

    # Process yearly CVE files
    for year in range(start_year, end_year + 1):
        folder_name = f"../data/CVEs/{str(year)}"
        file_name = f"nvdcve-1.1-{year}.json.gz"
        output_json = f"nvdcve-1.1-{year}.json"
        url = f"{base_url}nvdcve-1.1-{year}.json.gz"

        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        
        # Download the file
        print(f"Downloading {file_name}...")
        response = requests.get(url, stream=True)
        gz_path = os.path.join(folder_name, file_name)

        with open(gz_path, 'wb') as gz_file:
            gz_file.write(response.content)
        
        # Extract the .gz file
        print(f"Extracting {file_name}...")
        json_path = os.path.join(folder_name, output_json)
        with gzip.open(gz_path, 'rb') as f_in:
            with open(json_path, 'wb') as f_out:
                shutil.copyfileobj(f_in, f_out)
        
        print(f"Extracted {output_json} to folder {folder_name}.\n")

    # Process the extra links
    for link in extra_links:
        folder_name = f"../data/CVEs/{link['name']}"
        file_name = f"nvdcve-1.1-{link['name']}.json.zip"
        output_json = f"nvdcve-1.1-{link['name']}.json"
        url = link["url"]


        if not os.path.exists(folder_name):
            os.makedirs(folder_name)
        
        # Download the file
        print(f"Downloading {file_name}...")
        response = requests.get(url, stream=True)
        zip_path = os.path.join(folder_name, file_name)

        with open(zip_path, 'wb') as zip_file:
            zip_file.write(response.content)
        
        # Extract the .zip file
        print(f"Extracting {file_name}...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(folder_name)
        
        print(f"Extracted {output_json} to folder {folder_name}.\n")

    print("Download and extraction completed.")


# === CODE BLOCK 2: Build and Populate Database ===
def build_database():
    """Create and populate the PostgreSQL database with CVE and CPE data."""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cpe (
        cpe_id TEXT PRIMARY KEY
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cve (
        cpe_id TEXT,
        cve_id TEXT,
        cve_data JSONB,
        PRIMARY KEY (cpe_id, cve_id),
        FOREIGN KEY (cpe_id) REFERENCES cpe (cpe_id)
    )
    """)
    conn.commit()

    def process_json(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        cpe_cve_map = {}
        for item in data.get("CVE_Items", []):
            cve_id = item.get("cve", {}).get("CVE_data_meta", {}).get("ID", "Unknown")
            cve_full_data = json.dumps(item)
            configurations = item.get("configurations", {}).get("nodes", [])
            for node in configurations:
                for cpe in node.get("cpe_match", []):
                    cpe_uri = cpe.get("cpe23Uri")
                    if cpe_uri:
                        if cpe_uri not in cpe_cve_map:
                            cpe_cve_map[cpe_uri] = []
                        if cve_id not in [entry["cve_id"] for entry in cpe_cve_map[cpe_uri]]:
                            cpe_cve_map[cpe_uri].append({"cve_id": cve_id, "cve_data": cve_full_data})
        return cpe_cve_map

    def save_to_database(cpe_cve_map):
        for cpe, cves in cpe_cve_map.items():
            cursor.execute("INSERT INTO cpe (cpe_id) VALUES (%s) ON CONFLICT DO NOTHING", (cpe,))
            for cve_entry in cves:
                cursor.execute("""
                INSERT INTO cve (cpe_id, cve_id, cve_data)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
                """, (cpe, cve_entry["cve_id"], cve_entry["cve_data"]))
        conn.commit()

    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                print(f"Processing file: {file_path}")
                cpe_cve_map = process_json(file_path)
                save_to_database(cpe_cve_map)

    cursor.close()
    conn.close()
    print("Database created and populated successfully!")

# === CODE BLOCK 3: Update Database with Version Ranges ===
def update_database():
    """Update the database with version ranges."""
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor()

    def parse_version(version_str):
        try:
            return Version(version_str)
        except InvalidVersion:
            return None

    def process_json_for_version_ranges(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        for item in data.get("CVE_Items", []):
            cve_id = item.get("cve", {}).get("CVE_data_meta", {}).get("ID", "Unknown")
            full_cve_data = json.dumps(item)
            configurations = item.get("configurations", {}).get("nodes", [])
            for node in configurations:
                for cpe in node.get("cpe_match", []):
                    cpe_uri = cpe.get("cpe23Uri")
                    version_start = cpe.get("versionStartIncluding")
                    version_end = cpe.get("versionEndExcluding")
                    if cpe_uri and (version_start or version_end):
                        base_cpe = ":".join(cpe_uri.split(":")[:5])
                        cursor.execute("SELECT cpe_id FROM cpe WHERE cpe_id LIKE %s", (f"{base_cpe}%",))
                        matching_cpes = cursor.fetchall()
                        for matching_cpe_row in matching_cpes:
                            matching_cpe = matching_cpe_row[0]
                            version = matching_cpe.split(":")[5]
                            if parse_version(version):
                                cursor.execute("""
                                INSERT INTO cve (cpe_id, cve_id, cve_data)
                                VALUES (%s, %s, %s)
                                ON CONFLICT DO NOTHING
                                """, (matching_cpe, cve_id, full_cve_data))
        conn.commit()

    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                print(f"Processing file for version ranges: {file_path}")
                process_json_for_version_ranges(file_path)

    cursor.close()
    conn.close()
    print("Database updated successfully!")

# === MAIN FUNCTION ===
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="CVE Data Processor")
    parser.add_argument("command", choices=["extract_cve_data", "build_database", "update_database"],
                        help="Command to run: extract_cve_data, build_database, or update_database")
    args = parser.parse_args()

    if args.command == "extract_cve_data":
        download_and_extract_cve_data()
    elif args.command == "build_database":
        build_database()
    elif args.command == "update_database":
        update_database()
