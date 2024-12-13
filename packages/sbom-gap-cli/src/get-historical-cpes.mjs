import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import axios from 'axios';
import path from 'node:path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configContent = await fs.readFile(
  path.join(__dirname, '../config/config.json'),
);
const config = JSON.parse(configContent);
const baseUrl = config.cpeBaseUrl;

/**
 * Fetch all historical versions of a given CPE.
 *
 * @param {string} cpeName - The base CPE name eg: cpe:2.3:a:busybox:busybox:0.60.0:*:*:*:*:*:*:*.
 * @returns {object[]} - An array of historical CPEs.
 */
export async function fetchHistoricalCPEs(cpeName) {
  let historicalCPEs = [];

  try {
    // Use the /api/cpe-versions endpoint
    const response = await axios.post(baseUrl, { cpe: cpeName });

    if (response.data && Array.isArray(response.data.cpes)) {
      historicalCPEs = response.data.cpes.map((cpe) => ({
        cpeName: cpe.cpe_id,
        title: 'N/A',
        lastModified: 'N/A',
        created: 'N/A',
        deprecated: false,
      }));
    }
  } catch (error) {
    throw new Error(
      `Error fetching historical CPEs for ${cpeName}: ${error.message}`,
    );
  }

  return historicalCPEs;
}
