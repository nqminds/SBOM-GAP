import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'node:path';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const listOfCpes = [];

/**
 * Extracts CPE values from components.
 *
 * @param {string|object} sbomInput - Can take a path to an SBOM file or the SBOM data itself
 * @returns {string[]} Array of CPE strings.
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

  // extract CPE values from components
  sbomJson.components.forEach((component) => {
    if (component.cpe) {
      const cpe = component.cpe.replace('cpe:/a:', 'cpe:2.3:a:');
      listOfCpes.push(cpe);
    }
  });
  return listOfCpes;
}
