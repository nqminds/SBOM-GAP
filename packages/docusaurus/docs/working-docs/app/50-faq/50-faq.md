---
title: FAQ & Troubleshooting
---

Below are answers to some commonly asked questions and solutions to potential issues you may encounter while using the CYBER web app and its visualisation capabilities.

If [sbom.nqminds.com](http://sbom.nqminds.com/) does not display any results after uploading a valid SBOM with NIST and OpenAI API keys, consider the following possibilities:

* Incorrect API keys.
* A lengthy SBOM causing delays due to the endpoint's adherence to NIST API limits.
* An incorrect SBOM format (though user notifications should highlight incompatible files).

## Identifying Memory-Related CVE/CWEs

To determine which CVE/CWEs are related to memory protection issues and potentially addressable with CHERI, we utilize OpenAI's GPT 3.5 turbo model. All CWEs descriptions are classified into memory-related or not memory-related categories and stored in sbom-gap/vulnerability-reports/cwe_classifications.csv. For CWEs not listed, the tool queries OpenAI if an API key is available.

## Troubleshooting Steps

* Verify the validity of your NIST API key.
* Check your internet connection and retry the operation.
* Keep in mind that, like any service, the NIST API may occasionally experience high demand or other issues leading to temporary slowdowns or limitations. If your request doesn't go through, it might be worthwhile to wait a bit before attempting it again.
* Ensure your SBOM file is correctly formatted and compatible with the tool.
* Check the format and length of your SBOM; consider breaking down large SBOMs into smaller segments for analysis.

We hope these guidelines assist you in resolving any issues you encounter. Further improvements and enhancements to the tool are ongoing, and we welcome any feedback or additional questions you may have.
