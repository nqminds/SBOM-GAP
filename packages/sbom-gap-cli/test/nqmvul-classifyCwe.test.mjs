import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('nqmvul -classifyCwe command', () => {
  test('Classifies CPEs', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('nqmvul -classifyCwe CWE-354');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('CWE_ID CWE-354 has type:');
  });
});
