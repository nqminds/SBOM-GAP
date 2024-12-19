// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, test, expect } from '@jest/globals';
import { getCVEinfo } from '../src/get-historical-cves.mjs';

describe('getCVEinfo', () => {
  test('should return an array with correct CVE data', async () => {
    const cveId = 'CVE-2022-48174';
    const result = await getCVEinfo(cveId);

    // Validate the structure of the response
    const isValid = result.every(
      (item) =>
        typeof item.cve === 'string' &&
        typeof item.description === 'string' &&
        typeof item.baseScore === 'number' &&
        typeof item.impactScore === 'number' &&
        typeof item.exploitabilityScore === 'number' &&
        typeof item.publishedDate === 'string' &&
        typeof item.lastModifiedDate === 'string' &&
        typeof item.cveDataVersion === 'string',
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(isValid).toBe(true);

    const firstItem = result[0];
    expect(firstItem.cve).toBe(cveId);
    expect(firstItem.description).not.toBe('');
  });
});
