#!/bin/bash

# Directory containing SBOM files
SBOM_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/trivy_sboms"  # Update this path
OUTPUT_FILE="trivy_vulnerability_summary.txt"

# Ensure the output file is empty before starting
echo "Vulnerability Scan Summary" > "$OUTPUT_FILE"
echo "--------------------------" >> "$OUTPUT_FILE"

# Initialize counters
total_vulnerabilities=0

# Use a for loop instead of a pipeline to avoid subshell scoping issues
for sbom_file in $(find "$SBOM_DIR" -type f -name "*.json"); do
    echo "Scanning $sbom_file..."

    # Output file for the full grype scan
    debug_output="${sbom_file%.json}_grype_output.txt"

    # Run grype and save output
    grype sbom:"$sbom_file" -o table > "$debug_output" 2> "${debug_output%.txt}_errors.txt"

    # Check if `grype` finished successfully
    if [ $? -ne 0 ]; then
        echo "$(basename "$sbom_file"): Error during scan, see $(basename "${debug_output%.txt}_errors.txt")" >> "$OUTPUT_FILE"
        continue
    fi

    # Count the number of vulnerability rows in the grype output
    vulnerabilities=$(grep -v "^NAME" "$debug_output" | grep -v "TYPE" | grep -c "binary")

    # Write results to the summary file
    if [[ "$vulnerabilities" -gt 0 ]]; then
        echo "$(basename "$sbom_file"): $vulnerabilities vulnerabilities found" >> "$OUTPUT_FILE"
        total_vulnerabilities=$((total_vulnerabilities + vulnerabilities))  # Increment the total count
    else
        echo "$(basename "$sbom_file"): No vulnerabilities found" >> "$OUTPUT_FILE"
    fi

    echo "--------------------------" >> "$OUTPUT_FILE"
done

# Write the total number of vulnerabilities to the output file
echo "--------------------------" >> "$OUTPUT_FILE"
echo "Total vulnerabilities across all SBOMs: $total_vulnerabilities" >> "$OUTPUT_FILE"

# Display the summary
echo "Scan completed. Summary written to $OUTPUT_FILE"
