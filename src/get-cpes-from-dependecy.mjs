import fs from "fs";
import { fileURLToPath } from "url";
import path from "node:path";
import { dirname } from "path";
import { createCPEMapping, processDependencies } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Returns a list of cpes for each edpendency
 *
 * @param {string} projectName - name of your project
 */
export async function mapCPEs(projectName) {
  try {
    const conanFilePath = path.resolve(
      __dirname,
      `../vulnerability-reports/conan-files/${projectName}/conanfile.txt`
    );
    const dependencies = await processDependencies(conanFilePath);
    const csvFilePath = path.resolve(
      __dirname,
      "../vulnerability-reports/cpe_data.csv"
    );
    const cpeMapping = await createCPEMapping(csvFilePath, dependencies);
    const dirPath = path.resolve(
      __dirname,
      `../vulnerability-reports/cpes/${projectName}`
    );
    const cpeFilePath = path.join(dirPath, "cpeMapping.json");

    fs.mkdirSync(dirPath, { recursive: true }); // create directory if dosen't exist
    fs.writeFileSync(cpeFilePath, JSON.stringify(cpeMapping, null, 2));
  } catch (error) {
    throw new Error(` Error trying writing cpe mapping file:  ${error}`);
  }
}
