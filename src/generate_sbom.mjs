/* eslint-disable no-console */
import { fileURLToPath } from "url";
import path from "node:path";
import { dirname } from "path";
import { execFileSync } from "child_process";
import fs from "fs";

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
export function generateVulnerabilityReport(directoryPath, fileName) {
  // Execute syft command
  const sbomFile = path.resolve(
    __dirname,
    `../vulnerability-reports/sboms/${fileName}.json`
  );
  console.log("Running syft to generate SBOM...");
  const dockSyftArgs = [
    "run",
    "--rm",
    "-v",
    `${directoryPath}:/project`, // Mount the directory containing the repository
    "anchore/syft",
    "/project",
    "-o",
    "cyclonedx-json",
  ];

  try {
    // Increse the buffer size
    const sbomOutput = execFileSync("docker", dockSyftArgs, {
      encoding: "utf-8",
      maxBuffer: 1024 * 5000,
    });
    fs.writeFileSync(sbomFile, sbomOutput);

    console.log(`SBOM generation completed. SBOM saved to ${sbomFile}`);
  } catch (error) {
    throw new Error(`Error generating SBOM for ${directoryPath}: ${error}`);
  }
  // Execute grype command
  const vulnerabilityReportFile = path.resolve(
    __dirname,
    `../vulnerability-reports/reports/vulnerability_report_${fileName}`
  );
  try {
    console.log("Running grype to generate vulnerability report...");
    const grypeArgs = [
      "run",
      "--rm",
      "-v",
      `${path.dirname(sbomFile)}:/vulnerability-reports`, // Mount the directory containing the SBOM file
      "anchore/grype",
      `/vulnerability-reports/${path.basename(sbomFile)}`, // Reference the SBOM file by its name inside the container
      "-o",
      "table",
    ];

    const tableOutput = execFileSync("docker", grypeArgs, {
      encoding: "utf-8",
      maxBuffer: 1024 * 5000,
    });

    fs.writeFileSync(vulnerabilityReportFile, tableOutput);

    console.log(tableOutput);
    console.log(`Vulnerability report saved to: ${vulnerabilityReportFile}`);
  } catch (error) {
    throw new Error(
      `Error generating vulerability report for: ${vulnerabilityReportFile}, ${error}`
    );
  }
}
