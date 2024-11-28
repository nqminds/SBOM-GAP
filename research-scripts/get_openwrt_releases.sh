#!/bin/bash

BASE_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/source_code/openwrt_imagies/openwrt-104-data/extracted_images"  # Update this to your root directory
OUTPUT_FILE="openwrt_versions.txt"

echo "OpenWRT Versions List" > "$OUTPUT_FILE"
echo "---------------------" >> "$OUTPUT_FILE"

process_openwrt_release() {
    local file_path="$1"

    if [ -f "$file_path" ]; then
        echo "Processing $file_path..."
        echo "---------------------" >> "$OUTPUT_FILE"
        echo "File: $file_path" >> "$OUTPUT_FILE"
        cat "$file_path" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

find "$BASE_DIR" -type f -path "*/squashfs-root/etc/openwrt_release" | while read -r file; do
    process_openwrt_release "$file"
done

echo "Processing completed. Results saved to $OUTPUT_FILE"
