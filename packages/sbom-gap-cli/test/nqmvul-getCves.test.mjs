import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('nqmvul -getCves command', () => {
  test('retrieve CVEs for cpe', async () => {
    // eslint-disable-next-line prettier/prettier
    const { stdout, stderr } = await execAsync('nqmvul -getCves cpe:2.3:a:thekelleys:dnsmasq:2.85');

    expect(stderr).toBeFalsy();
    expect(stdout).toContain('CVE');
  });
});
