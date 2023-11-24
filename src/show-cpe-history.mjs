/* eslint-disable promise/prefer-await-to-then */
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cleanCpe } from "./get-syft-cpes.mjs";
import { fetchCVEsForCPE } from "./list-vulnerabilities.mjs";
import { classifyCwe } from "./classify_cwe.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Search the cpe_data.csv for a list of all known versions of a cpe
 *
 * @param {string} cpe - cpe
 * @param {string} hist - 'all' if we require all known cpes, defaults to 'hist' for past cpes versions
 * @returns {string[]} - Returns all previous/later relases of a cpe
 */
export async function mapHistorycalCpes(cpe, hist = "hist") {
  const cpeDataPath = path.resolve(
    __dirname,
    "../vulnerability-reports/cpe_data.csv"
  );
  const cpeParts = cpe.split(":");

  const cpeVersions = {};
  cpeVersions[cpe] = [];

  return new Promise((resolve, reject) => {
    let vendor;
    let product;
    let version;
    fs.createReadStream(cpeDataPath)
      .pipe(csvParser())
      .on("data", (row) => {
        const cpeName = row.cpe_name;

        vendor = cpeParts[3];
        product = cpeParts[4];
        version = cpeParts[5];
        if (
          cpeName &&
          hist === "all" &&
          cpeName.includes(`:${vendor}:`) &&
          cpeName.includes(`:${product}:`)
        ) {
          cpeVersions[cpe].push(cpeName);
          // TODO: Return all previous versions
        } else if (
          cpeName &&
          hist === "hist" &&
          cpeName.includes(`:${vendor}:`) &&
          cpeName.includes(`:${product}:`) &&
          cpeName.includes(`:${version.toString()}`)
        ) {
          cpeVersions[cpe].push(cpeName);
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
 * @param {string} hist - 'all' if we require all known cpes, defaults to 'hist' for past cpes versions
 * @returns {string[]} - Returns CPE-CVE-CWE-Type
 */
export async function mapCpeCveCwe(cpe, hist = "hist") {
  const cpeCveMap = [];
  const allPromises = [];
  const cpe_23 = cleanCpe(cpe);
  const cpeVersions = await mapHistorycalCpes(cpe_23, hist);

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
