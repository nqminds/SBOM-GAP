/* eslint-disable no-console */
import { fileURLToPath } from 'url';
import path from 'node:path';
import { dirname } from 'path';
import { execFileSync } from 'child_process';
import fs from 'fs';
import { genGrypeReport } from './utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate a vulnerability report based on the provided directory.
 *
 * @example
 * generateVulnerabilityReport("~/Repositories/cyber", "nodeproject");
 *
 * @param {string} directoryPath - Path to the directory.
 * @param {string} fileName - Name of the output JSON file for the SBOM.
 */
export function generateVulnerabilityReport(
  directoryPath,
  fileName,
  outputDir = null,
) {
  const defaultSbomDirectory = path.resolve(
    __dirname,
    '../vulnerability-reports/sboms',
  );
  const defaultReportDirectory = path.resolve(
    __dirname,
    '../vulnerability-reports/reports',
  );

  // Use the provided output directory or default directories
  const sbomDirectory = outputDir
    ? path.resolve(outputDir)
    : defaultSbomDirectory;
  const reportDirectory = outputDir
    ? path.resolve(outputDir)
    : defaultReportDirectory;

  const sbomFile = path.join(sbomDirectory, `${fileName}.json`);
  const vulnerabilityReportFile = path.join(
    reportDirectory,
    `vulnerability_report_${fileName}`,
  );

  // Ensure directories exist
  if (!fs.existsSync(sbomDirectory)) {
    fs.mkdirSync(sbomDirectory, { recursive: true });
  }
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
  }

  // Execute syft command
  console.log('Running syft to generate SBOM...');
  const dockSyftArgs = [
    'run',
    '--rm',
    '-v',
    `${directoryPath}:/project`, // Mount the directory containing the repository
    'anchore/syft',
    '/project',
    '-o',
    'cyclonedx-json',
  ];

  try {
    // Increse the buffer size
    const sbomOutput = execFileSync('docker', dockSyftArgs, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    });
    fs.writeFileSync(sbomFile, sbomOutput);

    console.log(`SBOM generation completed. SBOM saved to ${sbomFile}`);
  } catch (error) {
    throw new Error(`Error generating SBOM for ${directoryPath}: ${error}`);
  }
  // Execute grype command
  try {
    console.log('Running grype to generate vulnerability report...');
    const grypeArgs = [
      'run',
      '--rm',
      '-v',
      `${path.dirname(sbomFile)}:/vulnerability-reports`, // Mount the directory containing the SBOM file
      'anchore/grype',
      `/vulnerability-reports/${path.basename(sbomFile)}`, // Reference the SBOM file by its name inside the container
      '-o',
      'table',
    ];

    const tableOutput = execFileSync('docker', grypeArgs, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    });

    fs.writeFileSync(vulnerabilityReportFile, tableOutput);

    console.log(tableOutput);
    console.log(`Vulnerability report saved to: ${vulnerabilityReportFile}`);
  } catch (error) {
    throw new Error(
      `Error generating vulerability report for: ${vulnerabilityReportFile}, ${error}`,
    );
  }
}

/**
 * Generate a vulnerability report based on the provided Docker Image.
 *
 *
 * @param {string} imageName - Docker image name. e.g. nginx:latest
 * @param {string} fileName - Name of the output JSON file for the SBOM.
 */
export async function generateImageVulnerabilityReport(imageName, fileName) {
  const sbomDirectory = path.resolve(
    __dirname,
    '../vulnerability-reports/sboms',
  );
  const reportDirectory = path.resolve(
    __dirname,
    '../vulnerability-reports/reports',
  );
  const sbomFile = path.join(sbomDirectory, `${fileName}.json`);

  // Ensure directories exist
  if (!fs.existsSync(sbomDirectory)) {
    fs.mkdirSync(sbomDirectory, { recursive: true });
  }
  if (!fs.existsSync(reportDirectory)) {
    fs.mkdirSync(reportDirectory, { recursive: true });
  }

  // Generate SBOM for the Docker image using Syft
  console.log(
    `Running syft to generate SBOM for Docker image: ${imageName}...`,
  );
  const syftArgs = [
    'run',
    '--rm',
    'anchore/syft',
    imageName,
    '-o',
    'cyclonedx-json',
  ];

  try {
    const sbomOutput = execFileSync('docker', syftArgs, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000,
    });
    fs.writeFileSync(sbomFile, sbomOutput);

    console.log(
      `SBOM generation completed for Docker image. SBOM saved to ${sbomFile}`,
    );
  } catch (error) {
    throw new Error(
      `Error generating SBOM for Docker image ${imageName}: ${error}`,
    );
  }

  // Generate vulnerability report using Grype
  await genGrypeReport(sbomFile, fileName);
}
