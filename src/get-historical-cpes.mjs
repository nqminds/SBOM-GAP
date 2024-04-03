import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import axios from "axios";
import path from "node:path";
import { dirname } from "path";
import { getApiKey } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configContent = await fs.readFile(
  path.join(__dirname, "../config/config.json"),
);
const config = JSON.parse(configContent);
const apiKey = getApiKey("nist");
const baseUrl = config.cpeBaseUrl;
const headers = {};

if (apiKey) {
  headers.apiKey = apiKey;
}

/**
 * Extract vendor name from a full CPE string.
 *
 * @param {string} cpe - The full CPE string must in this form: 'vendorName:***'.
 * @returns {string} The vendor name.
 */
function extractVendorFromCPE(cpe) {
  const parts = cpe.split(":");
  return parts[3] || "";
}

/**
 * Fetch all historical versions of a given CPE.
 *
 * @param {string} cpeName - The base CPE name eg: cpe:2.3:a:busybox:busybox:0.60.0:*:*:*:*:*:*:*.
 * @returns {object[]} - An array of historical CPEs.
 */
// eslint-disable-next-line no-unused-vars
export async function fetchHistoricalCPEs(cpeName) {
  const vendorName = extractVendorFromCPE(cpeName);
  const formattedUrl = new URL(baseUrl);
  formattedUrl.searchParams.set("cpeMatchString", `cpe:2.3:*:${vendorName}`);

  let historicalCPEs = [];

  try {
    const response = await axios.get(formattedUrl, { headers });

    if (response.data.products && Array.isArray(response.data.products)) {
      historicalCPEs = response.data.products.map((product) => {
        return {
          cpeName: product.cpe.cpeName,
          title:
            product.cpe.titles?.find((title) => title.lang === "en")?.title ||
            "N/A",
          lastModified: product.cpe.lastModified,
          created: product.cpe.created,
          deprecated: product.cpe.deprecated,
        };
      });
    }
  } catch (error) {
    throw new Error(`Error fetching historical CPEs for ${cpeName}:`, error);
  }
  return historicalCPEs;
}
