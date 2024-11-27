#!/bin/bash

SOURCE_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/extracted_images"
DEST_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/trivy_sboms"

mkdir -p "$DEST_DIR"

for dir in "$SOURCE_DIR"/*; do
    if [ -d "$dir" ]; then
        dir_name=$(basename "$dir")
        
        output_file="$DEST_DIR/${dir_name}_sbom.cyclonedx.json"
        
        echo "Generating SBOM in CycloneDX format for $dir..."
        trivy fs --format cyclonedx --output "$output_file" "$dir"
        
        if [ $? -eq 0 ]; then
            echo "SBOM saved to $output_file"
        else
            echo "Failed to generate SBOM for $dir"
        fi
    fi
done

echo "SBOM generation in CycloneDX format completed."
