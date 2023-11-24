import { getVulnerabilities } from "../src/get-grype-vulnerabilities.mjs";
import { describe, test, expect } from "@jest/globals";

describe("getVulnerabilities", () => {
  test("should return an array of json objects", async () => {
    const vulData = `
NAME     INSTALLED  FIXED-IN  TYPE   VULNERABILITY  SEVERITY 
openssl  3                    conan  CVE-2023-0401  High      
openssl  3                    conan  CVE-2023-0217  High      
openssl  3                    conan  CVE-2023-0216  High      
openssl  3                    conan  CVE-2022-3996  High      
openssl  3                    conan  CVE-2022-3786  High      
openssl  3                    conan  CVE-2022-3602  High      
openssl  3                    conan  CVE-2022-3358  High      
openssl  3                    conan  CVE-2022-1473  High      
openssl  3                    conan  CVE-2021-4044  High      
openssl  3                    conan  CVE-2023-3446  Medium    
openssl  3                    conan  CVE-2023-2975  Medium    
openssl  3                    conan  CVE-2023-1255  Medium    
openssl  3                    conan  CVE-2022-4203  Medium    
openssl  3                    conan  CVE-2022-1434  Medium    
openssl  3                    conan  CVE-2022-1343  Medium    
        
        `;

    const missingFields = `
ansi-regex     3.0.0      3.0.1     npm                         High      
ansi-regex     5.0.0                npm    GHSA-93q8-gq69-wqmw  High      
file           0.0.0.0    0.0.1.0   conan  CVE-2007-1536        High      
file-type      14.7.1     16.5.4           GHSA-mhxj-85r3-2x55  High 
file-type      14.7.1     16.5.4    npm    GHSA-mhxj-85r3-2x55        
        `;

    const result = await getVulnerabilities(vulData);
    const result2 = await getVulnerabilities(missingFields);

    // test for undefined values and correct data type
    const isValid = result.every((item) => {
      return (
        typeof item.name === "string" &&
        typeof item.installed === "string" &&
        typeof item.fixedIn === "string" &&
        typeof item.type === "string" &&
        typeof item.vulnerability === "string" &&
        typeof item.severity === "string"
      );
    });

    // test various missing fields in the text data
    const isValid2 = [
      {
        name: "ansi-regex",
        installed: "3.0.0",
        fixedIn: "3.0.1",
        type: "npm",
        vulnerability: "", // missing
        severity: "High",
      },
      {
        name: "ansi-regex",
        installed: "5.0.0",
        fixedIn: "", // missing
        type: "npm",
        vulnerability: "GHSA-93q8-gq69-wqmw",
        severity: "High",
      },
      {
        name: "file",
        installed: "0.0.0.0",
        fixedIn: "0.0.1.0",
        type: "conan",
        vulnerability: "CVE-2007-1536",
        severity: "High",
      },
      {
        name: "file-type",
        installed: "14.7.1",
        fixedIn: "16.5.4",
        type: "", // missing
        vulnerability: "GHSA-mhxj-85r3-2x55",
        severity: "High",
      },
      {
        name: "file-type",
        installed: "14.7.1",
        fixedIn: "16.5.4",
        type: "npm",
        vulnerability: "GHSA-mhxj-85r3-2x55",
        severity: "", // missing
      },
    ];

    // expect the correct data types
    expect(isValid).toBeTruthy();
    expect(result2).toEqual(isValid2);
  });
});
