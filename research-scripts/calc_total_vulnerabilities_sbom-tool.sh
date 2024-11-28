#!/bin/bash

SBOM_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/source_code/OS_source-code/sboms/OSs_sboms/sbom-tool_sboms"
OUTPUT_FILE="sbom_tool_vulnerability_summary_OSs_sourcecode.txt"

echo "Vulnerability Scan Summary" > "$OUTPUT_FILE"
echo "--------------------------" >> "$OUTPUT_FILE"

total_vulnerabilities=0

for manifest_dir in "$SBOM_DIR"/*; do
    if [ -d "$manifest_dir" ]; then
        sbom_file="$manifest_dir/_manifest/spdx_2.2/manifest.spdx.json"
        
        if [ ! -f "$sbom_file" ]; then
            echo "SBOM not found: $sbom_file" >> "$OUTPUT_FILE"
            continue
        fi

        debug_output="${manifest_dir}/manifest_grype_output.txt"

        echo "Scanning $sbom_file..."
        grype sbom:"$sbom_file" -o table > "$debug_output" 2> "${debug_output%.txt}_errors.txt"

        if [ $? -ne 0 ]; then
            echo "$(basename "$manifest_dir"): Error during scan, see $(basename "${debug_output%.txt}_errors.txt")" >> "$OUTPUT_FILE"
            continue
        fi

        vulnerabilities=$(grep -v "^NAME" "$debug_output" | grep -v "TYPE" | grep -c "binary")

        if [[ "$vulnerabilities" -gt 0 ]]; then
            echo "$(basename "$manifest_dir"): $vulnerabilities vulnerabilities found" >> "$OUTPUT_FILE"
            total_vulnerabilities=$((total_vulnerabilities + vulnerabilities))  # Increment the total count
        else
            echo "$(basename "$manifest_dir"): No vulnerabilities found" >> "$OUTPUT_FILE"
        fi

        echo "--------------------------" >> "$OUTPUT_FILE"
    fi
done

echo "--------------------------" >> "$OUTPUT_FILE"
echo "Total vulnerabilities across all SBOMs: $total_vulnerabilities" >> "$OUTPUT_FILE"

echo "Scan completed. Summary written to $OUTPUT_FILE"
