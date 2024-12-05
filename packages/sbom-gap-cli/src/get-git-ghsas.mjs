import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
import { promises as fs } from 'fs';
import { getVulnerabilities } from './get-grype-vulnerabilities.mjs';
import { findFileInSubdirectories } from './utils.mjs';

/**
 * Scans the directory for a GHSA vulnerability JSON file and returns its content.
 *
 * @param {string} ghsa - GHSA string like "GHSA-hj48-42vr-x3v9"
 * @returns {object|null} - Returns an object if found, null otherwise
 */
export async function getGHSAInfo(ghsa) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const configContent = await fs.readFile(
    path.join(__dirname, '../config/config.json'),
  );
  const config = JSON.parse(configContent);
  // replace this path in ./config/config.json with your local advisory-database/advisories
  const advisoryDb = config.gitAdvisoryDbPath;

  const ghsaDatabase = path.resolve(__dirname, advisoryDb);

  // If not found in the direct path, then search recursively
  const ghsaFilePath = await findFileInSubdirectories(
    ghsaDatabase,
    `${ghsa}.json`,
  );
  if (ghsaFilePath) {
    const ghsaContent = await fs.readFile(ghsaFilePath, 'utf-8');
    return JSON.parse(ghsaContent);
  }

  return null;
}

/**
 * Processes the vulnerabilities fetched by getVulnerabilities.
 *
 * @param {string} vulReport - Path to grype vulnerability report file or text data
 * @returns {object[]} - Returns an array of GHSA objects
 */
export async function processVulnerabilities(vulReport) {
  const vulnerabilities = await getVulnerabilities(vulReport);
  const ghsaVulnerabilities = vulnerabilities
    .filter(
      (vuln) => vuln.vulnerability && vuln.vulnerability.startsWith('GHSA'),
    )
    .map((vul) => vul.vulnerability);

  return ghsaVulnerabilities;
}
