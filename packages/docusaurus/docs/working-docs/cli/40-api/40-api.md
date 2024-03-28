---
title: API
---
## Endpoint `sbomRiskAverage` 

This API endpoint is designed to calculate the average vulnerability score of a Software Bill of Materials (SBOM). By analysing the SBOM file submitted by the user, the server identifies all listed Common Vulnerabilities and Exposures (CVEs) for each Component Package Enumeration (CPE) found within the SBOM. Utilising multiple API calls to the NIST database, it then calculates the average base score of these vulnerabilities, providing a quantitative measure of the potential risk associated with the software components outlined in the SBOM.

* **Supported SBOM Format:**  
The endpoint currently supports SBOMs in the CycloneDX JSON format only.

* **Request Method:**  
POST URL: The endpoint can be accessed by appending /sbomRiskAverage to the host URL where the server is running.

* **Request Body:**  
The request must include a file containing the SBOM data. This file should be uploaded as part of a multipart/form-data request with the key file.

* **Response:**  
Success: On a successful request, the server responds with a JSON object containing the average vulnerability score of all CVEs found in the SBOM.

* **Example Response:**  
```json=
{7.21}
```

* **Failure:**  
If the request fails (e.g., due to missing file or server error), an appropriate error message is returned.


**Example Usage:**
```bash=
#### Bash
curl -X POST -F "file=@/path/to/your/SBOM.json" http://localhost:PORT/sbomRiskAverage
```


```javascript=
#### Javascrip
async function testApi() {
  const url = 'http://localhost:PORT/sbomRiskAverage';
  const form = new FormData();
  form.append('file', fs.createReadStream('/path/to/sbom.json'));

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders() // Include form headers
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();
```


### Security and Access Control
* **Public Access**: This API endpoint is publicly accessible and does not require authentication.

* **Note**: This documentation is intended for developers running the service locally or hosting their service. The exact endpoint for remote servers is not disclosed here.