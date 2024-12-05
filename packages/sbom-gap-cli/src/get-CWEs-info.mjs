import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'node:path';
import fs from 'fs';

/**
 * Scanns the local cweData.json for vulnerability information
 *
 *
 *@param {string[]} cwes - An Array of CWEs strings, ["CWE-476", "CWE-681"]
 *@returns {object[]} - Returns an Array of objects
 */
export function getCweInfo(cwes) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const cweDataFile = path.resolve(
    __dirname,
    '../vulnerability-reports/cweData.json',
  );
  const cweDataContent = fs.readFileSync(cweDataFile, 'utf-8');
  const cweData = JSON.parse(cweDataContent);

  // Filter the CWE data to only include the CWEs specified in the cwes parameter
  const cweInfo = cweData.filter((cwe) =>
    cwes.includes(`CWE-${cwe['CWE-ID']}`),
  );

  return cweInfo;
}
