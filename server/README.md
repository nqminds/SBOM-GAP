npm start

### Calling the `/sbomRiskAverage` API endpoint

This endpoint calculates the average vulnerability score of a Software Bill of Materials (SBOM). It accepts an SBOM file as input and returns the average score of all vulnerabilities listed in the SBOM.
Works with CycloneDX json sboms only

### Usage example:


Replace PORT with the port number where your server is running.

Input
* file: A file containing the SBOM data. The file should be uploaded as part of a multipart/form-data request.

Output
* Response: A JSON object containing the average vulnerability score. e.g. : 7.21%


#### Bash
```sh 
curl -X POST -F "file=@/path/to/your/SBOM.json" http://localhost:PORT/sbomRiskAverage
```

#### Javascrip
```javascript
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

const file = fs.createReadStream('/path/to/your/SBOM.json');
const form = new FormData();
form.append('file', file);

fetch('http://localhost:PORT/sbomRiskAverage', { method: 'POST', body: form })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

```