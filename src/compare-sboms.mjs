/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'node:path';
import { dirname } from 'path';
import { fetchCVEsWithRateLimit } from './list-vulnerabilities.mjs';
import { getVersion, extractCpeName } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Compares CVE data across multiple SBOMs.
 *
 * @param {string[]} sbomPaths - Array of paths to SBOM files.
 *
 * @returns {object} - A comparison result object.
 */
export async function compareSBOMs(sbomPaths) {
  const result = {};

  for (const sbomPath of sbomPaths) {
    const sbomName = path.basename(sbomPath);
    const cveData = await fetchCVEsWithRateLimit(sbomPath);

    for (const cpe of Object.keys(cveData)) {
      const component = extractCpeName(cpe);

      if (!result[component]) {
        result[component] = { versions: {}, cves: {} };
      }
      const versions = [getVersion(cpe)].filter(Boolean);
      const cves = cveData[cpe].map((cve) => cve.id);

      result[component].versions[sbomName] = versions.length ? versions : [];
      result[component].cves[sbomName] = cves.length ? [...new Set(cves)] : [];
    }
  }
  return result;
}

/**
 * Pretty prints the comparison result for multiple SBOMs and writes it to a file.
 *
 * @param {object} comparisonResult - The result from the compareSBOMs function.
 * @param {string[]} sbomPaths - Array of SBOM paths to show as headers.
 * @param {string} outputFile - Path of the file to save the output.
 */
export async function printComparisonResult(
  comparisonResult,
  sbomPaths,
  fileName = '',
) {
  let fileSaveName;
  if (fileName !== '') {
    fileSaveName = fileName;
  } else {
    fileSaveName = 'result';
  }

  // TODO: ADD possibility to chose file name
  const outputDir = path.join(
    __dirname,
    '../vulnerability-reports/comparisons',
  );
  const outputFile = path.join(outputDir, `${fileSaveName}.txt`);

  const filenames = sbomPaths.map((sbomPath) => path.basename(sbomPath));
  const columnWidth = filenames.reduce(
    (acc, name) => Math.max(acc, name.length),
    15,
  );

  const totalWidth = 20 + 3 + filenames.length * (columnWidth + 3) - 1;
  const separatorLine = '-'.repeat(totalWidth);

  let output =
    '------------------ SBOM Comparison Results ------------------\n\n';

  // Components Comparison
  output += `1. Components Comparison:\n${separatorLine}\n`;
  output += `| Component Name      | ${filenames.map((name) => name.padEnd(columnWidth)).join(' | ')} |\n${separatorLine}\n`;

  for (const [component, data] of Object.entries(comparisonResult)) {
    const presence = filenames.map((sbom) =>
      data.versions[sbom]?.length > 0
        ? 'Present'.padEnd(columnWidth)
        : 'Missing'.padEnd(columnWidth),
    );
    output += `| ${component.padEnd(20)} | ${presence.join(' | ')} |\n${separatorLine}\n`;
  }

  // Version Information
  output += `\n2. Version Information:\n${separatorLine}\n`;
  output += `| Component Name      | ${filenames.map((name) => `${name}`.padEnd(columnWidth)).join(' | ')} |\n${separatorLine}\n`;

  for (const [component, data] of Object.entries(comparisonResult)) {
    const maxVersions = Math.max(
      ...filenames.map((sbom) => data.versions[sbom]?.length || 0),
    );

    for (let i = 0; i < maxVersions; i += 1) {
      const versionRow = filenames
        .map((sbom) =>
          data.versions[sbom]?.[i]
            ? data.versions[sbom][i].padEnd(columnWidth)
            : ' '.padEnd(columnWidth),
        )
        .join(' | ');
      output += `| ${component.padEnd(20)} | ${versionRow} |\n`;
    }
    output += `${separatorLine}\n`;
  }

  // Vulnerabilities
  output += `\n3. Vulnerabilities:\n${separatorLine}\n`;
  output += `| Component Name      | ${filenames.map((name) => `${name}`.padEnd(columnWidth)).join(' | ')} |\n${separatorLine}\n`;

  for (const [component, data] of Object.entries(comparisonResult)) {
    const maxCVEs = Math.max(
      ...filenames.map((sbom) => data.cves[sbom]?.length || 0),
    );

    for (let i = 0; i < maxCVEs; i += 1) {
      const cveRow = filenames
        .map((sbom) =>
          data.cves[sbom]?.[i]
            ? data.cves[sbom][i].padEnd(columnWidth)
            : ' '.padEnd(columnWidth),
        )
        .join(' | ');
      output += `| ${component.padEnd(20)} | ${cveRow} |\n`;
    }
    output += `${separatorLine}\n`;
  }

  await fs.promises.mkdir(outputDir, { recursive: true });
  await fs.promises.writeFile(outputFile, output);
  console.log(
    `Data saved to ../vulnerability-reports/comparisons/${fileSaveName}.txt`,
  );
}
