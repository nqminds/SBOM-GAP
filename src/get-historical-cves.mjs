import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import axios from "axios";
import path from "node:path";
import { dirname } from "path";
import { getApiKey } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configContent = await fs.readFile(
  path.join(__dirname, "../config/config.json")
);
const config = JSON.parse(configContent);
const apiKey = getApiKey("nist");
const baseUrl = config.cveHistUrl;
const headers = {};

if (apiKey) {
  headers.apiKey = apiKey;
}

/**
 * Fetch all historical versions of a given CVE.
 *
 * @param {string} cveId - The base CVE name eg: CVE-2019-1010218.
 * @returns {object[]} - An array of historical CVEs.
 */
// eslint-disable-next-line no-unused-vars
export async function fetchHistoricalCVEs(cveId) {
  const formattedUrl = new URL(`${baseUrl}${new URLSearchParams({ cveId })}`);
  let historicalCVEs = [];

  try {
    const response = await axios.get(formattedUrl, { headers });
    if (response.data.cveChanges && Array.isArray(response.data.cveChanges)) {
      historicalCVEs = response.data.cveChanges.map((change) => {
        const mewCWEId = change.change.details
          ? change.change?.details
              .filter(
                (detail) => detail.type === "CWE" && detail.action === "Added"
              )
              .map((detail) => detail.newValue)
          : [];
        const oldCWEId = change.change.details
          ? change.change?.details
              .filter(
                (detail) => detail.type === "CWE" && detail.action === "Removed"
              )
              .map((detail) => detail.oldValue)
          : [];

        return {
          cveId: change.change.cveId,
          cveChangeId: change.change.cveChangeId,
          created: change.change.created,
          mewCWEId: mewCWEId,
          oldCWEId: oldCWEId,
        };
      });
    }
  } catch (error) {
    throw new Error(`Error fetching historical CVEs for ${cveId}:`, error);
  }
  return historicalCVEs;
}
