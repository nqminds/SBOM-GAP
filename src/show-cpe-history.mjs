/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
/* eslint-disable guard-for-in */
import fs from 'fs';
import csvParser from 'csv-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { cleanCpe } from './get-syft-cpes.mjs';
import { fetchCVEsForCPE } from './list-vulnerabilities.mjs';
import { classifyCwe } from './classify_cwe.mjs';
import { previousCpeVersion, getCpeVendor } from './utils.mjs';
import { makeClassificationRequest } from './classify_cve.mjs';

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
    '../vulnerability-reports/cpe_data.csv',
  );
  const cpeParts = cpe.split(':');

  const cpeVersions = {};
  cpeVersions[cpe] = [];

  return new Promise((resolve, reject) => {
    const vendor = cpeParts[3];
    const product = cpeParts[4];

    fs.createReadStream(cpeDataPath)
      .pipe(csvParser())
      .on('data', (row) => {
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
      .on('end', () => resolve(cpeVersions))
      .on('error', (error) => reject(error));
  });
}

/**
 * Function to find historycal CPEs and their weaknesses
 *
 * @param {string} cpe - CPE
 * @returns {string[]} - Returns CPE-CVE-CWE-Type
 */
export async function mapCpeCveCwe(cpe, includeHistoricalCpes = true) {
  const cpeCveMap = [];
  const allPromises = [];
  const cpe_23 = cleanCpe(cpe);
  let cpeVersions = {};

  if (includeHistoricalCpes) {
    cpeVersions = await mapHistoricalCpes(cpe_23);
  } else {
    cpeVersions[cpe_23] = [cpe_23];
  }

  for (const key in cpeVersions) {
    for (const element of cpeVersions[key]) {
      const cpe23 = cleanCpe(element);

      const promise = fetchCVEsForCPE(cpe23).then(async (cves) => {
        const innerPromises = [];
        if (cves && cves.length > 0) {
          for (const vulnerability of cves) {
            const cveId = vulnerability.id || 'N/A';
            const cweWeakness = Array.isArray(vulnerability.weakness)
              ? vulnerability.weakness
              : vulnerability.weakness
                ? [vulnerability.weakness]
                : ['N/A'];

            const classifications = [];

            for (const cwe of cweWeakness) {
              let classification = 'No info';
              if (
                cwe === 'NVD-CWE-noinfo' ||
                cwe === 'No info' ||
                cwe === 'NVD-CWE-Other'
              ) {
                classification = await makeClassificationRequest(
                  vulnerability.description,
                );
              }

              const validClassification =
                typeof classification === 'string' ? classification : 'No info';

              const innerPromise = classifyCwe(cwe).then((weakType) => {
                classifications.push(weakType || validClassification);
              });

              innerPromises.push(innerPromise);
            }

            await Promise.all(innerPromises);

            cpeCveMap.push({
              cpe: element,
              cve: cveId,
              cwe: cweWeakness,
              weakType: classifications,
            });
          }
        } else {
          cpeCveMap.push({
            cpe: element,
            cve: 'CVE No Info',
            cwe: ['CWE No Info'],
            weakType: ['Type No Info'],
          });
        }
      });

      allPromises.push(promise);
    }
  }

  await Promise.all(allPromises);

  const reportDirectory = path.resolve(
    __dirname,
    '../vulnerability-reports/output',
  );

  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
  }

  const fileName = await getCpeVendor(cpe);
  const histMap = path.join(reportDirectory, `${fileName}.json`);

  fs.writeFileSync(histMap, JSON.stringify(cpeCveMap, null, 2));

  return cpeCveMap;
}
