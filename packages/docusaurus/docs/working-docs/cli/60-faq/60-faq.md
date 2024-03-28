---
title: FAQ & Troubleshooting
---

Below are answers to some commonly asked questions and solutions to potential issues you may encounter while using the SBOM generation tool and its visualisation capabilities.

## Bad Request Error and Historical CPEs Fetching Error

If you encounter a "bad request" error or "Error: Error fetching historical CPEs" while using the nqmvul -getHistory or nqmvul -getHistoricalCpes commands, please ensure the following:

* The .env file containing your NIST API key is correctly placed in the SBOM-GAP directory.
* When using nqmvul -getHistoricalCpes, omit the surrounding quotation marks, i.e., use nqmvul -getHistoricalCpes cpe:2.3:\a:\busybox:busybox:1.33.2.



## Common causes for these errors include:

* An invalid NIST API key.
* A poor internet connection.
* The NIST API's occasional instability, which might temporarily restrict your key after numerous requests for the same CPE.
* No Output from SBOM Visualization Tool


## Identifying Memory-Related CVE/CWEs

To determine which CVE/CWEs are related to memory protection issues and potentially addressable with CHERI, we utilize OpenAI's GPT 3.5 turbo model. All CWEs descriptions are classified into memory-related or not memory-related categories and stored in sbom-gap/vulnerability-reports/cwe_classifications.csv. For CWEs not listed, the tool queries OpenAI if an API key is available.

## Troubleshooting Steps

* Verify the validity of your NIST API key and ensure it's correctly placed within the .env file.
* Check your internet connection and retry the operation.
* Consider the potential instability of the NIST API and try your request again after some time.

We hope these guidelines assist you in resolving any issues you encounter. Further improvements and enhancements to the tool are ongoing, and we welcome any feedback or additional questions you may have.
