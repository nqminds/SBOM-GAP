import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { expect } from '@jest/globals';

const execAsync = promisify(exec);

describe('nqmvul -getHistory command', () => {
  const projectRoot = process.cwd();
  const outputFilePath = path.join(projectRoot, 'output', 'output.txt');

  afterAll(() => {
    if (fs.existsSync(outputFilePath)) {
      try {
        fs.unlinkSync(outputFilePath);
      } catch (err) {
        throw new Error(`Failed to clean up the output file: ${err}`);
      }
    }
  });

  test('Provides a complete historical analyses of a CPE', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('nqmvul -getHistory cpe:2.3:a:sec_project:sec:-');
    expect(stderr).toBeFalsy();
    expect(stdout).toContain(
      'Trying to find related cpes for cpe:2.3:a:sec_project:sec:-, this may take a while...',
    );
    expect(stdout).toContain('Data saved to output/output.txt');
    const fileExists = fs.existsSync(outputFilePath);
    expect(fileExists).toBe(true);
  });
});
