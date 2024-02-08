/* eslint-disable promise/prefer-await-to-then */
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cleanCpe } from "./get-syft-cpes.mjs";
import { fetchCVEsForCPE } from "./list-vulnerabilities.mjs";
import { classifyCwe } from "./classify_cwe.mjs";
import { previousCpeVersion } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Search the cpe_data.csv for a list of all known versions of a cpe
 *
 * @param {string} cpe - cpe
 * @returns {string[]} - Returns all previous/later releases of a cpe
 */
export async function mapHistoricalCpes(cpe) {
  const cpeDataPath = path.resolve(
    __dirname,
    "../vulnerability-reports/cpe_data.csv"
  );
  const cpeParts = cpe.split(":");

  const cpeVersions = {};
  cpeVersions[cpe] = [];

  return new Promise((resolve, reject) => {
    const vendor = cpeParts[3];
    const product = cpeParts[4];

    fs.createReadStream(cpeDataPath)
      .pipe(csvParser())
      .on("data", (row) => {
        const cpeName = row.cpe_name;

        if (
          cpeName &&
          cpeName.includes(`:${vendor}:`) &&
          cpeName.includes(`:${product}:`)
        ) {
          // Check if the CPE from the row is a previous version of the input CPE
          if (previousCpeVersion(cpe, cpeName)) {
            cpeVersions[cpe].push(cpeName);
          }
        }
      })
      .on("end", () => resolve(cpeVersions))
      .on("error", (error) => reject(error));
  });
}


/**
 * Function to find historycal CPEs and their weaknesses
 *
 * @param {string} cpe - CPE
 * @returns {string[]} - Returns CPE-CVE-CWE-Type
 */
export async function mapCpeCveCwe(cpe) {
  const cpeCveMap = [];
  const allPromises = [];
  const cpe_23 = cleanCpe(cpe);
  const cpeVersions = await mapHistoricalCpes(cpe_23);

  for (const key in cpeVersions) {
    for (const element of cpeVersions[key]) {
      const cpe23 = cleanCpe(element);

      // create a promise for each element
      const promise = fetchCVEsForCPE(cpe23).then((cves) => {
        const innerPromises = [];
        if (cves.length > 0) {
          for (const vulnerability of cves) {
            const cveId = vulnerability.id || "N/A";
            const cweWeakness = Array.isArray(vulnerability.weakness)
              ? vulnerability.weakness
              : vulnerability.weakness
              ? [vulnerability.weakness]
              : ["N/A"];

            const innerPromise = classifyCwe(cweWeakness[0]).then(
              (weakType) => {
                cpeCveMap.push({
                  cpe: element,
                  cve: cveId,
                  cwe: cweWeakness,
                  weakType: weakType || "No Info",
                });
              }
            );

            innerPromises.push(innerPromise);
          }
        } else {
          cpeCveMap.push({
            cpe: element,
            cve: "CVE No Info",
            cwe: ["CWE No Info"],
            weakType: "Type No Info",
          });
        }
        return Promise.all(innerPromises); // resolve all inner promises
      });

      allPromises.push(promise);
    }
  }

  // resolve all promises
  await Promise.all(allPromises);
  return cpeCveMap;
}
