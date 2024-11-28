#!/bin/bash

GRYPE_OUTPUT_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/source_code/OS_source-code/sboms/OSs_sboms/syft_sboms"
OUTPUT_FILE="syft_vulnerability_summary_OSs_source-code.txt"

echo "Vulnerability Scan Summary" > "$OUTPUT_FILE"
echo "--------------------------" >> "$OUTPUT_FILE"

total_vulnerabilities=0

for grype_file in "$GRYPE_OUTPUT_DIR"/*.txt; do
    if [ -f "$grype_file" ]; then
        echo "Processing $grype_file..."

        vulnerabilities=$(grep -E '^[a-zA-Z0-9]' "$grype_file" | grep -c -E 'Critical|High|Medium|Low|Unknown')

        if [[ "$vulnerabilities" -gt 0 ]]; then
            echo "$(basename "$grype_file"): $vulnerabilities vulnerabilities found" >> "$OUTPUT_FILE"
            total_vulnerabilities=$((total_vulnerabilities + vulnerabilities))  # Increment the total count
        else
            echo "$(basename "$grype_file"): No vulnerabilities found" >> "$OUTPUT_FILE"
        fi

        echo "--------------------------" >> "$OUTPUT_FILE"
    fi
done

echo "--------------------------" >> "$OUTPUT_FILE"
echo "Total vulnerabilities across all Grype outputs: $total_vulnerabilities" >> "$OUTPUT_FILE"

echo "Processing completed. Summary written to $OUTPUT_FILE"
