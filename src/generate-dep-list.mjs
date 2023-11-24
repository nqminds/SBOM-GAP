/* eslint-disable no-console */
import { fileURLToPath } from "url";
import path from "node:path";
import { dirname } from "path";
import { spawnSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate a dependency report based on the provided c/cpp directory.
 *
 * @example
 * const cppDierectory = "~/path/to/cpp_repository"
 * const projectName = "repository_name"
 *
 * generateDependencyList(ccScannerPath, cppDierectory, projectName, envPath)
 *
 * @param {string} cppDirectory - Absolute path to directory to be scanned.
 * @param {string} projectName - Name of your project
 */
export function generateDependencyList(cppDirectory, projectName) {
  const dependenciesFilePath = path.resolve(
    __dirname,
    "../vulnerability-reports/ccsDependencies"
  );

  const dockerArgs = [
    "run",
    "--rm",
    `-u`,
    `${process.getuid()}:${process.getgid()}`,
    `-v`,
    `${cppDirectory}:/usr/src/project`,
    `-v`,
    `${dependenciesFilePath}:/usr/src/results`,
    `--workdir`,
    `/usr/src/app/ccscanner`,
    `--entrypoint`,
    `python`,
    `ionutnqm/depscanner:latest`,
    `ccscanner/scanner.py`,
    `-d`,
    `/usr/src/project`,
    `-t`,
    `/usr/src/results/${projectName}_dependencies`,
  ];

  try {
    const dockerProcess = spawnSync("docker", dockerArgs, {
      encoding: "utf-8",
    });

    if (dockerProcess.error) {
      throw dockerProcess.error;
    }

    if (dockerProcess.stderr) {
      throw new Error(`Error: ${dockerProcess.stderr}`);
    }

    console.log("dependency scanning completed.");
    console.log(
      `dependency list saved to ${dependenciesFilePath}/${projectName}_dependencies`
    );
  } catch (error) {
    throw new Error(`Error error scanning directory ${cppDirectory}: ${error}`);
  }
}
