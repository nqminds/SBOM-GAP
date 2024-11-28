#!/bin/bash

PROJECT_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/extracted_images"  
OUTPUT_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/ccscanner_sboms"  
VULNERABILITY_SUMMARY_FILE="$OUTPUT_DIR/vulnerability_summary.txt"

mkdir -p "$OUTPUT_DIR/sboms"
mkdir -p "$OUTPUT_DIR/reports"

echo "Vulnerability Scan Summary" > "$VULNERABILITY_SUMMARY_FILE"
echo "--------------------------" >> "$VULNERABILITY_SUMMARY_FILE"


total_vulnerabilities=0

for project_path in "$PROJECT_DIR"/*; do
    if [ -d "$project_path" ]; then
        project_name=$(basename "$project_path")

        echo "Processing project: $project_name..."

        nqmvul -generateCCPPReport "$project_path" "$project_name"
        
        SBOM_PATH="/home/ionut/Repositories/Sbom_cli/sbom-cli/vulnerability-reports/sboms/${project_name}_sbom.json"
        REPORT_PATH="/home/ionut/Repositories/Sbom_cli/sbom-cli/vulnerability-reports/reports/vulnerability_report_${project_name}"

        if [ -f "$SBOM_PATH" ]; then
            cp "$SBOM_PATH" "$OUTPUT_DIR/sboms/"
            echo "Copied SBOM for $project_name to $OUTPUT_DIR/sboms/"
        else
            echo "SBOM not found for $project_name"
        fi

        if [ -f "$REPORT_PATH" ]; then
            cp "$REPORT_PATH" "$OUTPUT_DIR/reports/"
            echo "Copied vulnerability report for $project_name to $OUTPUT_DIR/reports/"
        else
            echo "Vulnerability report not found for $project_name"
        fi

        if [ -f "$REPORT_PATH" ]; then
            vulnerabilities=$(grep -E '^[a-zA-Z0-9]' "$REPORT_PATH" | grep -c -E 'Critical|High|Medium|Low|Unknown')
            if [[ "$vulnerabilities" -gt 0 ]]; then
                echo "$project_name: $vulnerabilities vulnerabilities found" >> "$VULNERABILITY_SUMMARY_FILE"
                total_vulnerabilities=$((total_vulnerabilities + vulnerabilities))
            else
                echo "$project_name: No vulnerabilities found" >> "$VULNERABILITY_SUMMARY_FILE"
            fi
        fi

        echo "--------------------------" >> "$VULNERABILITY_SUMMARY_FILE"
    fi
done

echo "--------------------------" >> "$VULNERABILITY_SUMMARY_FILE"
echo "Total vulnerabilities across all projects: $total_vulnerabilities" >> "$VULNERABILITY_SUMMARY_FILE"

echo "Processing completed. Summary written to $VULNERABILITY_SUMMARY_FILE"
