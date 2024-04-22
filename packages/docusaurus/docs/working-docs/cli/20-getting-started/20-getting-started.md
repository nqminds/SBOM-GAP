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

### Download the vulnerability-reports folder and place it in SBOM-GAP module:

- vulnerability-reports directory can be downloaded from [here](https://drive.google.com/file/d/1ZV302sOZXYu7JUiM5fVgrMi3lYxGw1VH/view?usp=drive_link). This also contains all the (National Vulnerability Database)[NVD](https://nvd.nist.gov/) CPE/CWE data. (recommended)

### Download the cpe2.3 database

- Cpe2.3 database [link](https://drive.google.com/file/d/12xd1ze7x7QB7GCNTpzyDGp9BOK52OlG7/view?usp=sharing)
- Unzip this and add it to data/

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

If, after running `npm install`, you do not see a list of Docker containers like the following when running `docker ps -a`:
```sh
vboxuser@testbinwaLlk:~$ docker ps -a

CONTAINER ID    IMAGE                         COMMAND                    CREATED             STATUS           PORTS  NAMES

5a2541bb6992    sbom-gap-nqmvul                "python ./ccscanner/.."    2 days ago          Exited (2)       2 days ago  sbom-gap-nqmvul-1

717bb93ecc87    ionutngm/depscanner:latest    "python ./ccscanner/.."    2 days ago          Exited (1)       2 days ago  sbom-gap-ccscanner-1

6bb149d9d68e    anchore/grype                   "/grype"                  2 days ago          Exited (1)       2 days ago  sbom-gap-grype-1

4442271050da    anchore/syft                    "/syft"                   2 days ago          Exited (1)       2 days ago  sbom-gap-syft-1

4d9869d9be3a    ionutngm/binwalk_v4:latest    "binwalk"                  2 days ago          Exited (1)       2 days ago  sbom-gap-binwalk-1

```
This could indicate that the Docker Compose version on your system differs from the expected version, or that the container images haven't been downloaded. To resolve this, you can try the following:
1. Check Docker and Docker Compose Installation: Ensure Docker and Docker Compose are installed and functioning correctly. Run `docker --version` and `docker-compose --version` or `docker compose version` to verify their versions.

2. Run Docker Compose with Root Permissions: If you suspect permission issues, you can run the following command to ensure all containers are started:

```sh
sudo docker compose up -d
```
or
```sh
sudo docker-compose up -d
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

