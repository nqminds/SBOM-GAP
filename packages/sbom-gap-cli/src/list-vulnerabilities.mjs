/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { fileURLToPath } from 'url';
import fs, { promises as fsPromise } from 'fs';
import axios from 'axios';
import path from 'node:path';
import { dirname } from 'path';
import { cleanCpe } from './get-syft-cpes.mjs';
import { readOrParseSbom } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseDir = path.join(__dirname, '../data');

// Check if the directory exists, if not, create it
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const configContent = await fsPromise.readFile(
  path.join(__dirname, '../config/config.json'),
);
const config = JSON.parse(configContent);
const baseUrl = config.cveBaseUrl;
let cveData = {};

/**
 *Function to fetch CVEs for a single CPE
 *
 * @param {string} cpeName - The base CPE name eg: cpe:2.3:a:busybox:busybox:0.60.0:*:*:*:*:*:*:*.
 * @param {string} apiEndpoint - API Endpoint
 * @returns {object[]} - For each CPE returns an array of CVEs. {"cpe": [{CVE}, {CVE} ... ]}
 */
export async function fetchCVEsForCPE(cpeName, apiEndpoint = baseUrl) {
  if (!cpeName) {
    console.error('CPE name is required');
    return null;
  }

  try {
    const response = await axios.post(apiEndpoint, { cpe: cpeName });

    if (response.status === 200 && response.data) {
      const { data, matches } = response.data;

      if (data && matches) {
        const cves = data.map((vulnerability) => {
          let description =
            vulnerability.cve_data.cve.description?.description_data?.find(
              (desc) => desc.lang === 'en',
            )?.value || 'Not Found';

          // Sanitize description to remove excessive newlines
          description = description.replace(/\n+/g, ' ').trim();

          const weaknesses =
            vulnerability.cve_data.cve.problemtype?.problemtype_data?.map(
              (problem) =>
                problem.description?.find((desc) => desc.lang === 'en')
                  ?.value || 'Not Found',
            );

          const baseScore =
            vulnerability.cve_data.impact?.baseMetricV3?.cvssV3?.baseScore ||
            vulnerability.cve_data.impact?.baseMetricV2?.cvssV2?.baseScore ||
            '0';

          const baseSeverity =
            vulnerability.cve_data.impact?.baseMetricV3?.cvssV3?.baseSeverity ||
            vulnerability.cve_data.impact?.baseMetricV2?.severity ||
            'Unknown';

          return {
            id: vulnerability.cve_id,
            description,
            weakness: weaknesses,
            baseScore,
            baseSeverity,
          };
        });

        return cves;
      }
      console.warn(`No CVE data returned for CPE: ${cpeName}`);
      return null;
    }
    console.error(
      `Failed to fetch CVEs: ${response.status} - ${response.statusText}`,
    );
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error for CPE ${cpeName}:`,
        error.response?.data || error.message,
      );
    } else {
      console.error(`Unexpected error for CPE ${cpeName}:`, error.message);
    }
    return null;
  }
}

/**
 * Function to control the rate of API requests.
 *
 * @param {string|object} sbomPath - Path to SBOM file or JSON object.
 *
 * @returns {object} - An object where each key is a CPE, and the value is the corresponding array of CVEs.
 */
export async function fetchCVEsWithRateLimit(sbomPath) {
  cveData = {};
  const sbomJson = await readOrParseSbom(sbomPath, __dirname);

  try {
    const cvePromises = sbomJson.components.map(async (component) => {
      if (!component.cpe || component.cpe.trim() === '') {
        return null; // Skip if CPE is not defined or is empty
      }
      const cpeName = await cleanCpe(component.cpe);
      const fetchedCves = await fetchCVEsForCPE(cpeName);
      if (fetchedCves) {
        cveData[cpeName] = fetchedCves;
      }
    });

    await Promise.all(cvePromises);
  } catch (error) {
    throw new Error(`Error fetching CVEs with rate limit: ${error.message}`);
  }
  return cveData;
}

/**
 * Function to write cve data to file.
 *
 * @param {string|object} sbomPath - Path to sbomFile or json object
 * @param {string} outputPath - Absolute path to saved CveData
 *
 */
export async function writeCvesToFile(sbomPath, outputPath) {
  // Call the function to fetch CVEs with rate limiting
  const cveJsonData = await fetchCVEsWithRateLimit(sbomPath);
  // After all requests are completed, save cveData to a JSON file
  const jsonContent = JSON.stringify(cveJsonData, null, 2);

  try {
    await fsPromise.writeFile(
      path.resolve(__dirname, `${outputPath}/cveData.json`),
      jsonContent,
    );
  } catch (err) {
    throw new Error(`Error saving cveData to file: ${err.message}`);
  }
}
