/* eslint-disable no-console */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Generate a Binwalk extraction report based on the provided file.
 *
 * @example
 * generateBinwalkReport("/path/to/project", "-Me", "openwrt-23.05.3-mediatek-filogic-acer_predator-w6-initramfs-kernel.bin");
 *
 * @param {string} directoryPath - Path to the directory containing the file.
 * @param {string} fileName - Name of the file to analyse.
 * @param {string} binwalkFlags - Flags to use with binwalk.
 */
export function generateBinwalkReport(directoryPath, binwalkFlags, fileName) {
  const outputDirectory = path.resolve(__dirname, '../binwalk-reports');
  const outputFile = path.join(
    outputDirectory,
    `${fileName}_extraction_report`,
  );
  let binwalkArgs;

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  console.log('Running Binwalk to extract data...');
  if (binwalkFlags === '') {
    binwalkArgs = [
      'run',
      '--rm',
      '-v',
      `${directoryPath}:/home/linuxbrew/data`,
      'ionutnqm/binwalk_v4:latest',
      `/home/linuxbrew/data/${fileName}`,
    ];
  } else {
    const flags = binwalkFlags.replace(/[\\[\]]/g, '');
    binwalkArgs = [
      'run',
      '--rm',
      '-v',
      `${directoryPath}:/home/linuxbrew/data`,
      'ionutnqm/binwalk_v4:latest',
      ...flags.split(' '),
      `/home/linuxbrew/data/${fileName}`,
    ];
  }
  try {
    // Increase the buffer size if needed
    const extractionOutput = execFileSync('docker', binwalkArgs, {
      encoding: 'utf-8',
      maxBuffer: 1024 * 5000, // Adjust buffer size as necessary
    });
    fs.writeFileSync(outputFile, extractionOutput);

    console.log(`Extraction report saved to: ${outputFile}`);
  } catch (error) {
    throw new Error(`Error extracting data for ${fileName}: ${error}`);
  }
}
