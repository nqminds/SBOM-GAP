---
title: FAQ & Troubleshooting
---

Below are answers to some commonly asked questions and solutions to potential issues you may encounter while using the SBOM generation tool and its visualisation capabilities.

## Bad Request Error and Historical CPEs Fetching Error

If you encounter a "bad request" error or "Error: Error fetching historical CPEs" while using the nqmvul -getHistory or nqmvul -getHistoricalCpes commands, please ensure the following:

* The .env file containing your NIST API key is correctly placed in the SBOM-GAP directory.
When using nqmvul -getHistoricalCpes, omit the surrounding quotation marks, i.e., use nqmvul -getHistoricalCpes cpe:2.3:\a:\busybox:busybox:1.33.2.

* Switch to the feat/add-cpe-local-search branch for better reliability.

## Common causes for these errors include:

* An invalid NIST API key.
* A poor internet connection.
* The NIST API's occasional instability, which might temporarily restrict your key after numerous requests for the same CPE.
* No Output from SBOM Visualization Tool


If sbom.nqminds.com does not display any results after uploading a valid SBOM with NIST and OpenAI API keys, consider the following possibilities:

* Incorrect API keys.
A lengthy SBOM causing delays due to the endpoint's adherence to NIST API limits.
An incorrect SBOM format (though user notifications should highlight incompatible files).
Identifying Memory-Related CVE/CWEs
To determine which CVE/CWEs are related to memory protection issues and potentially addressable with CHERI, we utilize OpenAI's GPT 3.5 turbo model. All CWEs descriptions are classified into memory-related or not memory-related categories and stored in sbom-cli/vulnerability-reports/cwe_classifications.csv. For CWEs not listed, the tool queries OpenAI if an API key is available. In the absence of a classification and API key, CWEs default to being categorized as memory-related to avoid false positives.

Troubleshooting Steps
Verify the validity of your NIST API key and ensure it's correctly placed within the .env file.
Check your internet connection and retry the operation.
Consider the potential instability of the NIST API and try your request again after some time.
Ensure your SBOM file is correctly formatted and compatible with the tool.
Check the format and length of your SBOM; consider breaking down large SBOMs into smaller segments for analysis.
We hope these guidelines assist you in resolving any issues you encounter. Further improvements and enhancements to the tool are ongoing, and we welcome any feedback or additional questions you may have.
