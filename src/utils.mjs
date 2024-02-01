/* eslint-disable no-console */
import dotenv from "dotenv";
import fs from "fs";
import csvParser from "csv-parser";
import readline from "readline";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";
import semver from "semver";

/**
 * Mapps dependencies to cpes
 *
 *@param {string} filePath - csvFilepath
 *@param {string []} dependencies - dependencies
 */
export async function createCPEMapping(filePath, dependencies) {
  const cpeMapping = {};
  dependencies.forEach((dep) => (cpeMapping[dep] = []));

  return new Promise((resolve, reject) => {
    // use read stream to reduce memory usage.
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        const cpeName = row.cpe_name;
        dependencies.forEach((dep) => {
          let searchDep = dep;
          let version = "";

          if (dep.includes(":")) {
            [, version] = dep.split(":");
            searchDep = searchDep.replace(/:.*/, "");
          }

          if (
            cpeName &&
            cpeName.includes(`:${searchDep}:`) &&
            cpeName.includes(`:${version}`) &&
            (cpeMapping[dep].length === 0 ||
              !previousCpeVersion(cpeMapping[dep][0], cpeName))
          ) {
            cpeMapping[dep] = [cpeName];
          }
        });
      })
      .on("end", () => resolve(cpeMapping))
      .on("error", (error) => reject(error));
  });
}

/**
 * Determines whether a CPE is a previous version
 *
 * @param {string} currentCpe - The current CPE
 * @param {string} cpeToCheck - CPE to check if it is a previous version
 * @returns {boolean} cpeToCheck is a previous version
 */
export function previousCpeVersion(currentCpe, cpeToCheck) {
  return semver.lte(getVersion(cpeToCheck), getVersion(currentCpe));
}

/**
 * Attempts to extract the version for a given CPE.
 * If no version is found, it returns "0.0.0"
 *
 * @param {string} cpe - CPE of which you want the version
 * @returns {string} Version number
 */
export function getVersion(cpe) {
  // Remove CPE version:
  const withoutCpeVersion = cpe.replace(/^cpe:[0-9]+(\.[0-9]+)+:/, "");

  // Define the regular expression pattern
  // Should match any version number (including 1.2.3-alpha, 1.2.3+build 1.2.3a)
  const regex = /:\b\d+(?:\.\d+){0,3}(?:-\w+)?(?:\+\w+)?(.)?\b/;
  try {
    const stringVersion = regex.exec(withoutCpeVersion);
    // Remove ":" at the begining
    const version = stringVersion[0].substring(1);
    const returnValue = semver.valid(semver.coerce(version));
    return returnValue || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/**
 * Returns a list of dependencies
 *
 * @param {string} conanfilePath - path to conanfile.txt
 */
export async function processDependencies(conanfilePath) {
  // the file can become quite large so use ReadStream to reduce memory usage
  const fileStream = fs.createReadStream(conanfilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const dependencies = [];
  let isRequiresSection = false;

  for await (const line of rl) {
    if (line.startsWith("[requires]")) {
      isRequiresSection = true;
    } else if (line.startsWith("[")) {
      isRequiresSection = false;
    } else if (isRequiresSection) {
      let dependency = line.replace("/", ":");
      dependency = dependency.replace(/'/g, "");
      if (dependency) {
        // check that the string is not empty after trimming
        dependencies.push(dependency);
      }
    }
  }
  return dependencies;
}

/**
 * Returns the path to a targetFile
 *
 * @param {path} startDirectory - Path to the start dyrectory
 * @param {string} targetFile - Name of the file
 */
export async function findFileInSubdirectories(startDirectory, targetFile) {
  const recurseDir = async (dir) => {
    const filesAndDirectories = await fs.promises.readdir(dir, {
      withFileTypes: true,
    });

    const promises = filesAndDirectories.map(async (stat) => {
      if (stat.isDirectory()) {
        return recurseDir(path.join(dir, stat.name));
      } else if (stat.name === targetFile) {
        return path.join(dir, stat.name);
      }
      return null;
    });
    const results = await Promise.all(promises);
    for (const result of results) {
      if (result) return result;
    }
    return null;
  };
  return recurseDir(startDirectory);
}

/**
 * Get API Key from .env
 *
 * @param {string} name - Name of the API KEY
 * @returns {string} - ApiKey
 */
export function getApiKey(name) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  dotenv.config({ path: path.resolve(__dirname, "../.env") });

  switch (name) {
    case "nist":
      return process.env.NIST_API_KEY;
    case "openai":
      return process.env.OPENAI_API_KEY;
    default:
      throw new Error(`API key for '${name}' is not found.`);
  }
}

/**
 * Function to generate a Grype report
 *
 * @param {string} sbomFilePath - Path to sbom file
 * @param {string} projectName - Project name
 */
export async function genGrypeReport(sbomFilePath, projectName) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const vulnerabilityReportFile = path.resolve(
    __dirname,
    `../vulnerability-reports/reports/vulnerability_report_${projectName}`
  );
  try {
    console.log("Running grype to generate vulnerability report...");
    const grypeArgs = [
      "run",
      "--rm",
      "-v",
      `${path.dirname(sbomFilePath)}:/vulnerability-reports`, // Mount the directory containing the SBOM file
      "anchore/grype",
      `/vulnerability-reports/${path.basename(sbomFilePath)}`, // Reference the SBOM file by its name inside the container
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
      `Error generating vulnerability report for: ${vulnerabilityReportFile}, ${error}`
    );
  }
}


/**
 * 
 * @param {json} cvesData - path to sbom file or JSON object
 * @returns {json} - A JSON object containing the average vulnerability score
 */
export function calculateAverageBaseScore(cvesData) {
  let totalScore = 0;
  let count = 0;

  for (const key in cvesData) {
    const cveArray = cvesData[key];
    cveArray.forEach(cve => {
      if (cve.baseScore) {
        totalScore += cve.baseScore;
        count++;
      }
    });
  }

  const average = count > 0 ? totalScore / count : 0;
  return parseFloat(average.toFixed(2));
}
