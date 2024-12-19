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

const baseUrl = config.cveHistUrl;

/**
 * Search the database for a specific CVE ID and return its data.
 *
 * @param {string} cve - The CVE ID to search for (e.g., "CVE-2022-48174").
 * @returns {object|null} - The CVE data if found, or null if not found.
 */
export async function getCVEinfo(cve) {
  const historicalCVEs = [];

  try {
    const response = await axios.post(baseUrl, { cveId: cve });
    if (response.data && response.data.data) {
      const cveData = response.data.data;
      historicalCVEs.push({
        cve: cveData.cve_id,
        description:
          cveData.cve_data.cve.description.description_data[0].value || '',
        baseScore: cveData.cve_data.impact.baseMetricV3.cvssV3.baseScore || '',
        impactScore: cveData.cve_data.impact.baseMetricV3.impactScore || '',
        exploitabilityScore:
          cveData.cve_data.impact.baseMetricV3.exploitabilityScore || '',
        publishedDate: cveData.cve_data.publishedDate || '',
        lastModifiedDate: cveData.cve_data.lastModifiedDate || '',
        cveDataVersion: cveData.cve_data.configurations.CVE_data_version || '',
      });
    }
  } catch (error) {
    throw new Error(
      `Error fetching historical CVEs for ${cve}: ${error.message}`,
    );
  }

  return historicalCVEs;
}
