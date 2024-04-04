---
slug: /
title: CLI Tool
---
# Overview

[SBOM-GAP](https://github.com/nqminds/SBOM-GAP) (Generation and Analysis Platform)  is a Software Bill of Materials (SBOM) generation tool designed for enhancing the security posture of your software projects. At its core, sbom-gap streamlines the process of generating, analysing, and managing SBOMs across various filesystems. Leveraging tools like [Syft](https://github.com/anchore/syft), [Grype](https://github.com/anchore/grype), and [CCscanner](https://github.com/lkpsg/ccscanner), sbom-gap offers comprehensive vulnerability analysis, providing critical insights into potential security risks within software dependencies.

This tool offers actionable intelligence that enables teams to identify, understand, and mitigate vulnerabilities effectively.

## Features
### Comprehensive SBOM Generation: 
Generate detailed SBOMs for a variety of filesystems. Understand the composition of your software at a granular level.

### In-depth Vulnerability Analysis: 
Utilise integrated tools like Syft, Grype, and CCS scanner to conduct thorough vulnerability assessments. Gain insights into vulnerabilities associated with your software components.

### Command Suite: 
Whether you need to analyse a single component with `-getCves` or generate a comprehensive report with `-generateCCPPReport`, sbom-gap offers a wide range of commands to cater to different aspects of SBOM and vulnerability management. These commands range from generating SBOMs to mapping CPES and classifying CWEs.

### Historical Data Access:
Access historical data on CPES and CVEs, providing a broader context for understanding how vulnerabilities evolve over time. This feature is invaluable for assessing the long-term security implications of specific components or vulnerabilities.

### CWE and GHSA Information:
Retrieve detailed information on Common Weakness Enumerations (CWEs) and GitHub Security Advisories (GHSAs), further enriching the analysis and ensuring a more informed decision-making process regarding security vulnerabilities.

