# Project Overview

Welcome to the Software Bill of Materials (SBOM) Ecosystem repository. This repository hosts a suite of tools and services designed to handle SBOM generation, analysis, and data processing for Common Platform Enumerations (CPE) and related NIST datasets. The ecosystem is structured into multiple components, each addressing a specific functionality.

--- 

## Repository Structure

This repository consists of the following major components:

* Documentation Website

Built with Docusaurus.

Go to Documentation [README](packages/docusaurus/README.md)

* SBOM Generation and Analysis CLI Tool

A command-line interface tool to generate SBOMs and analyze their components for vulnerabilities over time.

Go to SBOM CLI [README](packages/sbom-gap-cli/README.md)

* API for Serving CPE Data

A RESTful API that serves CPE data to the CLI tool and other web applications.

Go to API [README](packages/sbom-gap-cli/nist-data-api/README.md)

* NIST Data Processing Pipeline

A pipeline that downloads raw NIST data, processes it, and populates a PostgreSQL database for use by other components.

Go to NIST Processing [README](packages/sbom-gap-cli/Sbom-GAP-Firmware-Prediction-Model/notebooks/README.md)

---

## Prerequisites

* Node.js and npm
* Python3
* PostgreSQL
* Docker

---

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE.

---

## Contact

For questions or feedback, please open an issue in this repository.