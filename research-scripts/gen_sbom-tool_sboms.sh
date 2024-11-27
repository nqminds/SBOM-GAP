#!/bin/bash

SOURCE_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/extracted_images"
DEST_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/sbom-tool_sboms/test"

mkdir -p "$DEST_DIR"

SBOM_TOOL="sbom-tool" 

PACKAGE_SUPPLIER="D-Link Corporation"

for dir in "$SOURCE_DIR"/*; do
    if [ -d "$dir" ]; then
        dir_name=$(basename "$dir")
        
        output_path="$DEST_DIR/${dir_name}_sbom_manifest"
        
        mkdir -p "$output_path"
        
        echo "Generating SBOM for $dir using sbom-tool..."
        "$SBOM_TOOL" generate \
            -b "$dir" \
            -m "$output_path" \
            -pn "$dir_name" \
            -pv "1.0.0" \
            -ps "$PACKAGE_SUPPLIER" \
            -V Information
        
        if [ $? -eq 0 ]; then
            echo "SBOM saved to $output_path"
        else
            echo "Failed to generate SBOM for $dir"
        fi
    fi
done

echo "SBOM generation using sbom-tool completed."
