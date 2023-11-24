import { fileURLToPath } from "url";
import PQueue from "p-queue";
import { promises as fs } from "fs";
import { getCpes } from "./get-syft-cpes.mjs";
import axios from "axios";
import path from "node:path";
import { dirname } from "path";
import Bottleneck from "bottleneck";
import { getApiKey } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configContent = await fs.readFile(
  path.join(__dirname, "../config/config.json")
);
const config = JSON.parse(configContent);
const apiKey = getApiKey("nist");
const baseUrl = config.cveBaseUrl;
export const cveData = {};
const previousResponses = [];
const headers = {};
const queue = new PQueue({ concurrency: 1 });

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
    if (typeof obj[key] === "object" && obj[key] !== null) {
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
export async function fetchCVEsForCPE(cpeName, nistApiKey = "") {
  if (nistApiKey !== "") {
    headers.apiKey = nistApiKey;
  }
  const formattedUrl = `${baseUrl}?cpeName=${cpeName}`;
  try {
    const response = await limiter.schedule(() =>
      axios.get(formattedUrl, { headers })
    );
    // more data can be added here as needed
    const cves = response.data.vulnerabilities
      .map((vulnerability) => {
        const weaknesses = vulnerability.cve.weaknesses?.map((weakness) => {
          return (
            weakness.description?.find((desc) => desc.lang === "en")?.value ||
            "Not Found"
          );
        });
        const baseScore =
          findPropertyRecursively(vulnerability.cve.metrics, "baseScore") ||
          "0";
        const baseSeverity =
          findPropertyRecursively(vulnerability.cve.metrics, "baseSeverity") ||
          "0";

        return {
          id: vulnerability.cve.id,
          description:
            vulnerability.cve.descriptions?.find((desc) => desc.lang === "en")
              ?.value || "Not Found",
          weakness: weaknesses,
          baseScore: baseScore,
          baseSeverity: baseSeverity,
        };
      })
      .filter((cve) => cve && cve.id && cve.description);
    cveData[cpeName] = cves;
    // Store the response in the previousResponses array
    previousResponses.push({ cpeName, cves });
    return cves;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error for ${cpeName}:`, error);
    return null;
  }
}

/**
 * Function to control the rate of API requests.
 *
 * @param {string|object} sbomPath - Path to sbomFile or json object
 *
 * @returns {string[]} Array of  CVEs.
 */
export async function fetchCVEsWithRateLimit(sbomPath) {
  try {
    const cpes = await getCpes(sbomPath);
    // Add all API requests to the queue
    await Promise.all(
      cpes.map((cpeName) => queue.add(() => fetchCVEsForCPE(cpeName)))
    );
    // Wait for all requests in the queue to complete
    await queue.onIdle();
  } catch (error) {
    throw new Error(`Error: ${Error.message}`);
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
    await fs.writeFile(
      path.resolve(__dirname, `${outputPath}/cveData.json`),
      jsonContent
    );
  } catch (err) {
    throw new Error(`Error saving cveData to file: ${err.message}`);
  }
}
