#!/bin/bash


SPDX_SBOM_DIR="/home/ionut/Repositories/Sbom_cli/TEST_SCANNERS/dlink/dlink-397-101/sbom-tool_sboms"
CYCLONEDX_CLI="cyclonedx-linux-x64"


find "$SPDX_SBOM_DIR" -type f -name "manifest.spdx.json" | while read -r spdx_file; do
    modified_spdx_file="${spdx_file/manifest.spdx.json/manifest_modified.spdx.json}"
    cyclonedx_file="${spdx_file/manifest.spdx.json/manifest.cyclonedx.json}"
    
    echo "Removing externalRefs from $spdx_file..."
    jq 'del(.packages[].externalRefs)' "$spdx_file" > "$modified_spdx_file"
    if [ $? -eq 0 ]; then
        echo "Modified SPDX file saved to $modified_spdx_file"
    else
        echo "Failed to process $spdx_file"
        continue
    fi
    t
    echo "Converting modified SPDX file to CycloneDX format..."
    $CYCLONEDX_CLI convert \
        --input-file "$modified_spdx_file" \
        --output-file "$cyclonedx_file" \
        --input-format spdxjson \
        --output-format json \
        --output-version v1_4
    
    if [ $? -eq 0 ]; then
        echo "CycloneDX SBOM saved to $cyclonedx_file"
    else
        echo "Failed to convert $modified_spdx_file to CycloneDX format"
    fi
done

echo "Processing completed."
