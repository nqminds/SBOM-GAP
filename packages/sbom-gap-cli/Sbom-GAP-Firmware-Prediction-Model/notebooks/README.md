# CVE Data Processor

This Python script automates the process of downloading, extracting, and populating CVE (Common Vulnerabilities and Exposures) data into a PostgreSQL database. It also allows updating the database with version-specific information.

---

## Features

This script includes the following functionality:

1. Download and Extract CVE Data: Fetches CVE data from the NVD JSON feed for the years 2002–2024.
2. Build Database: Creates a PostgreSQL database schema and populates it with CPE-CVE mappings extracted from downloaded JSON files.
3. Update Database: Processes CVE data for version ranges and updates the database with applicable entries.

---

## Requirements
Ensure the following software and libraries are installed:

* Python 3.8+
* PostgreSQL (version 16+ recommended)

Required Python Libraries:
* psycopg2
* requests
* packaging

## Install libraries

```bash
pip3 install psycopg2 requests packaging
```

---
# Setup

Database Configuration:

* Ensure PostgreSQL is installed and running.
* Update the database credentials in the script:

```python
DB_CONFIG = {
    "dbname": "cve_database",
    "user": "postgres",
    "password": "ionut",
    "host": "localhost",
    "port": 5432
}
```

Make the Script Executable:

```bash
chmod +x cve_processor.py
```
---

# Usage
Run the script with one of the following commands:

1. Extract CVE Data
This command downloads and extracts CVE JSON files for the specified years.

```bash
python3 cve_processor.py extract_cve_data
```

How it works:

Downloads .gz files from NVD for each year (2002–2024).
Extracts the JSON data into the ../data/CVEs directory.

2. Build Database
This command creates the database schema and populates it with CVE and CPE data.

```bash
python3 cve_processor.py build_database
```

Creates two tables:
cpe: Stores unique CPE entries.
cve: Stores CVE entries mapped to CPEs.
Processes JSON files in the ../data/CVEs directory and inserts the data into the database.

3. Update Database

This command updates the database with version-specific CVE data.

```bash
python3 cve_processor.py update_database
```
How it works:

Reads JSON files from the ../data/CVEs directory.
Identifies CVEs with version ranges and updates the database.
