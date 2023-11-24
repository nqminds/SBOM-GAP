import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "node:path";
import fs from "fs";
import csv from "csv-parser";

/**
 * Returns the type of vulnerability
 *
 * @param {string} cweId - Vulnerability id, e.g. : CWE-354
 */
export async function classifyCwe(cweId) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const cweClassifications = path.resolve(
    __dirname,
    "../vulnerability-reports/cwe_classifications.csv"
  );
  const cweParts = cweId.split("-");
  const cwe = cweParts[1];

  return new Promise((resolve, reject) => {
    fs.createReadStream(cweClassifications)
      .pipe(csv())
      .on("data", (row) => {
        if (row.CWE_ID === cwe) {
          resolve(row.Type);
        }
      })
      .on("end", () => {
        resolve(null); // Return null if the CWE_ID was not found in the CSV
      })
      .on("error", reject);
  });
}
