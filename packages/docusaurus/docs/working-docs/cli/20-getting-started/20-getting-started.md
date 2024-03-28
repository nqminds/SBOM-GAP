---
title: Getting Started
---
## Prerequisites

Before installing the [SBOM-GAP](https://github.com/nqminds/SBOM-GAP) (Generation and Analysis Platform) tool, ensure you have the following prerequisites installed on your machine:

* Node.js: Version `16.16.0` or newer. SBOM-GAP relies on Node.js to run. You can check your current Node version by running `node --version` in your terminal.
npm (Node Package Manager): Version `8.7.0` or newer, which usually comes with Node.js. Verify your npm version with `npm --version`.

* Docker: [Docker](https://www.docker.com/get-started/) is required for running certain services that SBOM-GAP depends on.
* Docker Compose: [Docker Compose](https://docs.docker.com/compose/install/) is used for managing multi-container Docker applications.

## Installation Guide

### Clone the SBOM-GAP Repository: 
Clone the official repository to get started with SBOM-GAP.
```sh
git clone https://github.com/nqminds/SBOM-GAP.git
```

### Ensure Node.js and npm are Installed: 
Verify the installation and versions of Node.js and npm.

```sh
node --version
v16.16.0
```

```sh
npm --version
8.11.0
```

### Install [Docker](https://www.docker.com/get-started/) and [Docker Compose](https://docs.docker.com/compose/install/): 
Make sure Docker and Docker Compose are installed and correctly set up on your machine. Instructions can be found on their respective websites.

### Add Current User to Docker Group: 
This step allows you to run Docker commands without sudo.

```sh
sudo usermod -aG docker $USER
```

### Make Docker Compose Executable:
Ensure Docker Compose can be executed by making it executable.
```sh
sudo chmod +x /usr/local/bin/docker-compose
```

### Install SBOM-GAP Dependencies: 
Navigate to the SBOM-GAP directory and install all required dependencies.

```sh
cd SBOM-GAP
npm install
```

### Create a Global Symlink to nqmvul Tool:
Make the nqmvul tool globally accessible by creating a symlink.

```sh
npm link
```

### Configure Git Advisory Database Path:
If you're using GHSA vulnerability codes, download the Git Advisory Database and update the config/config.json path accordingly.

```json=
{
  "gitAdvisoryDbPath": "/path/to/advisory-database/advisories"
}
```

### Obtain and Configure [NIST API Key](https://nvd.nist.gov/developers/request-an-api-key): 
For improved performance with NIST API requests, obtain an API key and add it to a .env file in the root directory.

```yaml=
NIST_API_KEY=your_NIST_api_key
```

### Include [OpenAI API Key](https://platform.openai.com/api-keys):
For advanced classification of weaknesses, include your OpenAI API key in the .env file.

```yaml=
OPENAI_API_KEY=your_OpenAi_api_key
```

