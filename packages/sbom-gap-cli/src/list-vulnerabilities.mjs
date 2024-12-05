/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
import { fileURLToPath } from 'url';
import fs, { promises as fsPromise } from 'fs';
import axios from 'axios';
import path from 'node:path';
import { dirname } from 'path';
import Bottleneck from 'bottleneck';
import { cleanCpe } from './get-syft-cpes.mjs';
import {
  getApiKey,
  readOrParseSbom,
  validateCPE,
  getVersion,
  extractCpeName,
} from './utils.mjs';
import {
  initialiseDatabase,
  insertOrUpdateCPEData,
  getCPEData,
} from './database.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const databaseDir = path.join(__dirname, '../data');
const databasePath = path.join(databaseDir, 'cached_cpes.db');

// Check if the directory exists, if not, create it
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const configContent = await fsPromise.readFile(
  path.join(__dirname, '../config/config.json'),
);
const config = JSON.parse(configContent);
const apiKey = getApiKey('nist');
const baseUrl = config.cveBaseUrl;
let cveData = {};
const previousResponses = [];
const headers = {};

if (apiKey) {
  headers.apiKey = apiKey;
}

// 30000ms / 50ms = 600ms, 50 requests per 30 second = 1 request per 600ms
const limiter = new Bottleneck({
  minTime: 600,
  maxConcurrent: 1,
});

function findPropertyRecursively(obj, propertyName) {
  // eslint-disable-next-line no-prototype-builtins
  if (obj.hasOwnProperty(propertyName)) {
    return obj[propertyName];
  }

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const found = findPropertyRecursively(obj[key], propertyName);
      if (found !== undefined) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 *Function to fetch CVEs for a single CPE
 *
 * @param {string} cpeName - The base CPE name eg: cpe:2.3:a:busybox:busybox:0.60.0:*:*:*:*:*:*:*.
 * @param {string} nistApiKey - Nist API Key
 * @returns {object[]} - For each CPE returns an array of CVEs. {"cpe": [{CVE}, {CVE} ... ]}
 */
export async function fetchCVEsForCPE(cpeName, nistApiKey = '') {
  if (nistApiKey !== '') {
    headers.apiKey = nistApiKey;
  }

  let cves;
  const name = await extractCpeName(cpeName);
  const version = await getVersion(cpeName);
  const isValid = await validateCPE(cpeName);

  if (!isValid) {
    console.error(`CPE ${cpeName} not found in local database.`);
    return null;
  }
  await initialiseDatabase(databasePath);
  const formattedUrl = `${baseUrl}?cpeName=${cpeName}`;
  try {
    const existingData = await getCPEData(cpeName, databasePath);

    if (existingData) {
      cves = JSON.parse(existingData.cves);
      cveData[cpeName] = cves;
    } else {
      const response = await limiter.schedule(() =>
        axios.get(formattedUrl, { headers }),
      );

      cves = response.data.vulnerabilities
        .map((vulnerability) => {
          const weaknesses = vulnerability.cve.weaknesses?.map(
            (weakness) =>
              weakness.description?.find((desc) => desc.lang === 'en')?.value ||
              'Not Found',
          );
          const baseScore =
            findPropertyRecursively(vulnerability.cve.metrics, 'baseScore') ||
            '0';
          const baseSeverity =
            findPropertyRecursively(
              vulnerability.cve.metrics,
              'baseSeverity',
            ) || '0';
          return {
            id: vulnerability.cve.id,
            description:
              vulnerability.cve.descriptions?.find((desc) => desc.lang === 'en')
                ?.value || 'Not Found',
            weakness: weaknesses,
            baseScore,
            baseSeverity,
          };
        })
        .filter((cve) => cve && cve.id && cve.description);
      await insertOrUpdateCPEData(
        cpeName,
        name,
        version,
        JSON.stringify(cves),
        databasePath,
      );
      cveData[cpeName] = cves;
    }
    previousResponses.push({ cpeName, cves });
    return cves;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response ? error.response.status : 'Unknown';
      const statusText = error.response ? error.response.statusText : 'Unknown';
      const errorMessage = `AxiosError: ${status} - ${statusText}`;

      console.error(`Error for ${cpeName}: ${errorMessage}`);

      if (status === 404) {
        console.error(`The resource for ${cpeName} was not found.`);
      } else if (status === 401) {
        console.error('Unauthorized request. Please check your API key.');
      } else if (status === 500) {
        console.error('Server error. Try again later.');
      }
      return null;
    }
    console.error(`Unexpected error for ${cpeName}: ${error.message}`);
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
      const fetchedCves = await fetchCVEsForCPE(cpeName, apiKey);
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
