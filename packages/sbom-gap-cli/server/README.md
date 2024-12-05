Install API Dependencies:

```sh
npm install
```

To start, run:

```sh
npm start
```

### Calling the `/sbomRiskAverage` API endpoint

This endpoint calculates the average vulnerability score of a Software Bill of Materials (SBOM). It accepts an SBOM file as input and returns the average score of all vulnerabilities listed in the SBOM.
Works with CycloneDX json sboms only

### Usage example:

Replace PORT with the port number where your server is running.

Input

- file: A file containing the SBOM data. The file should be uploaded as part of a multipart/form-data request.

Output

- Response: A JSON object containing the average vulnerability score. e.g. : 7.21%

#### Bash

```sh
curl -X POST -F "file=@/path/to/your/SBOM.json" http://localhost:PORT/sbomRiskAverage
```

#### Javascrip

```javascript
async function testApi() {
  const url = "http://localhost:PORT/sbomRiskAverage";
  const form = new FormData();
  form.append("file", fs.createReadStream("/path/to/sbom.json"));

  try {
    const response = await fetch(url, {
      method: "POST",
      body: form,
      headers: {
        ...form.getHeaders(), // Include form headers
      },
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

testApi();
```
