import { exec } from 'child_process';
import { describe, test, expect } from '@jest/globals';

describe('nqmvul -help command', () => {
  test('should display the help text', (done) => {
    exec('nqmvul -help', (error, stdout, stderr) => {
      expect(error).toBeNull();
      expect(stderr).toBe('');
      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('Arguments:');
      expect(stdout).toContain('-getCpes');
      done();
    });
  });
});
