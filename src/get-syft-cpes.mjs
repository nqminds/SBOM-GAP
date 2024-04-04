import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'node:path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Returns a cpe in 2.3 format
 *
 * @param {string} cpe - any cpe format
 * @returns {string} - A cpe in 2.3 format
 */
export function cleanCpe(cpe) {
  // Remove trailing special characters and backslashes
  const cpeCleaned = cpe.replace(/:~~~.*?~~/g, '').replace(/\\/g, '');

  // Pattern for CPE 2.3 format (cpe:2.3:[any_letter]:...)
  const cpe23Pattern = /^cpe:2\.3:[a-z]:/i;

  // Pattern for legacy CPE format (cpe:/[any_letter]:...)
  const legacyCpePattern = /^cpe:\/[a-z]:/i;

  // If already in CPE 2.3 format, return as is
  if (cpe23Pattern.test(cpeCleaned)) {
    return cpeCleaned;
  }
  // Convert from legacy CPE format to CPE 2.3 format
  if (legacyCpePattern.test(cpeCleaned)) {
    return cpeCleaned.replace('cpe:/', 'cpe:2.3:');
  }

  // Return the original for any other format
  return cpe;
}

/**
 * Extracts CPE values from components.
 *
 * @example
 * getCpes("../vulnerability-reports/cyberxbom.json");
 *
 * @param {string|object} sbomInput - Path to the SBOM JSON file.
 * @returns {string[]} - Array of CPE strings.
 */
export async function getCpes(sbomInput) {
  let sbomJson;
  let resolvedPath;

  // check if the input is a string (path) or an object (data)
  if (typeof sbomInput === 'string') {
    // path from cli tool
    resolvedPath = path.resolve(process.cwd(), sbomInput);

    if (!fs.existsSync(resolvedPath)) {
      // if path doesn't exist, use relative to __dirname
      resolvedPath = path.resolve(__dirname, sbomInput);
    }

    // re-check if the path exists
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found at ${resolvedPath}`);
    }

    const sbomData = fs.readFileSync(resolvedPath);
    sbomJson = JSON.parse(sbomData);
  } else if (typeof sbomInput === 'object' && sbomInput !== null) {
    sbomJson = sbomInput;
  } else {
    throw new Error(
      'Invalid input. Please provide either a path to an SBOM file or the SBOM data itself.',
    );
  }

  const listOfCpes = [];

  // extract CPE values from components
  sbomJson.components.forEach((component) => {
    if (component.cpe) {
      const cleanedCpe = cleanCpe(component.cpe);
      listOfCpes.push(cleanedCpe);
    }
  });
  return listOfCpes;
}
