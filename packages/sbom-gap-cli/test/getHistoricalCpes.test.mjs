import { describe, test, expect } from '@jest/globals';
import { fetchHistoricalCPEs } from '../src/get-historical-cpes.mjs';

describe('fetchHistoricalCpes', () => {
  test('should return an array of json objects', async () => {
    const result = await fetchHistoricalCPEs(
      'cpe:2.3:a:busybox:busybox:1.33.2',
    );

    const isValid = result.every(
      (item) =>
        typeof item.cpeName === 'string' &&
        typeof item.title === 'string' &&
        typeof item.lastModified === 'string' &&
        typeof item.created === 'string' &&
        typeof item.deprecated === 'boolean',
    );

    // expect the correct data types
    expect(isValid).toBeTruthy();
  });
});
