import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import path from 'node:path';
import { dirname } from 'path';

// read the JSON file and parsing the data
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function sanitiseDependency(originalDep) {
  if (!originalDep) return null;

  let sanitisedDep = originalDep;

  // remove everything inside {} including {}
  sanitisedDep = sanitisedDep.replace(/\{.*?\}/g, '');

  // remove unwanted characters like "$" "=", "{", "}", and '"'
  sanitisedDep = sanitisedDep.replace(/[="{}$]/g, '');

  // remove trailing dashes
  sanitisedDep = sanitisedDep.replace(/-($|\W)/g, '$1');

  // replace multiple slashes with a single slash
  sanitisedDep = sanitisedDep.replace(/\/+/g, '/');

  return sanitisedDep;
}

/**
 * function to convert json objects to conan dependencies
 *
 * @example
 * run generateDependencyList(ccScannerPath, path/to/edgesec/repository, edgesec, envPath)
 * then
 * generateConanFile(edgesec)
 * make sure edgesec_dependencies exists in vulnerability-reports/cssDependencies/
 *
 *@param {string} projectName - Projecs Name
 */
export async function generateConanFile(projectName) {
  const addedDeps = new Set();
  const generators = new Set();

  try {
    const ccsFilePath = path.resolve(
      __dirname,
      '../vulnerability-reports/ccsDependencies/',
      `${projectName}_dependencies`,
    );
    const conanFileDir = path.resolve(
      __dirname,
      '../vulnerability-reports/conan-files/',
      projectName,
    );
    await fs.mkdir(conanFileDir, { recursive: true }); // create the directory if it does not exist
    const conanFilePath = path.join(conanFileDir, 'conanfile.txt');
    const fileContents = await fs.readFile(ccsFilePath, 'utf-8');
    const jsonData = JSON.parse(fileContents);

    let fileData = '[requires]\n';

    // looping through extractors and dependencies
    jsonData.extractors.forEach((extractor) => {
      extractor.deps.forEach((dep) => {
        const sanitisedDepName = sanitiseDependency(dep.depname);
        const sanitisedVersion = sanitiseDependency(dep.version);
        // if version name is present we attach it
        if (sanitisedDepName && sanitisedVersion) {
          const depString = sanitisedVersion
            ? `${sanitisedDepName}/${sanitisedVersion}`
            : sanitisedDepName;
          const generatorsString = `${dep.extractor_type}`;

          // if the dependency/generator is not in the set, add it to the set and write to file
          if (!addedDeps.has(depString)) {
            addedDeps.add(depString);
            fileData += `${depString}\n`;
          }
          if (!generators.has(generatorsString)) {
            generators.add(generatorsString);
          }
          // add only the dependency name
        } else if (sanitisedDepName) {
          const generatorsString = `${dep.extractor_type}`;
          // if the dependency/generator is not in the set, add it to the set and write to file
          if (!addedDeps.has(sanitisedDepName)) {
            addedDeps.add(sanitisedDepName);
            fileData += `${sanitisedDepName}\n`;
          }
          if (!generators.has(generatorsString)) {
            generators.add(generatorsString);
          }
        }
      });
    });

    fileData += '\n[generators]\n';
    generators.forEach((generator) => {
      fileData += `${generator}\n`;
    });

    await fs.writeFile(conanFilePath, fileData, 'utf-8');
  } catch (error) {
    throw new Error(
      `Error trying to generate conanfile for the project ${projectName}: ${error}`,
    );
  }
}
