import { describe, test, expect } from '@jest/globals';
import { getVersion, previousCpeVersion } from '../src/utils.mjs';

describe('getVersion', () => {
  const cpes = {
    validWithVersion: 'cpe:2.3:a:openssl:openssl:3.1.2:*:*:*:*:*:*:*',
    validWithoutVersion: 'cpe:2.3:a:openssl:openssl:-:*:*:*:*:*:*:*',
    validWithCharacters: 'cpe:2.3:a:openssl:openssl:0.9.2b:*:*:*:*:*:*:*',
    betaVersion: 'cpe:2.3:a:openssl:openssl:0.9.3:alpha:*:*:*:*:*:*',
    betaVersionDash: 'cpe:2.3:a:openssl:openssl:0.9.3-beta:*:*:*:*:*:*',
    betaVersionPlus: 'cpe:2.3:a:openssl:openssl:0.9.3+beta2:*:*:*:*:*:*',
    withNumbersWithVersion:
      'cpe:2.3:a:ghost:sqlite3.2.1:5.1.5:*:*:*:*:node.js:*:*',
    withNumbersWithoutVersion: 'cpe:2.3:h:samsung:galaxy_s22:-:*:*:*:*:*:*:*',
    invalidCpe: 'hello world',
  };

  test('Should accept a valid CPE with a version number', async () => {
    const response = getVersion(cpes.validWithVersion);
    expect(typeof response).toBe('string');
    expect(response).toBe('3.1.2');
  });
  test('Should accept a valid CPE without a version number', async () => {
    const response = getVersion(cpes.validWithoutVersion);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.0.0');
  });
  test('Should accept a valid CPE with a version number including characters', async () => {
    const response = getVersion(cpes.validWithCharacters);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.9.2');
  });
  test('Should accept a valid CPE with a version number including :release', async () => {
    const response = getVersion(cpes.betaVersion);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.9.3');
  });
  test('Should accept a valid CPE with a version number including -release', async () => {
    const response = getVersion(cpes.betaVersionDash);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.9.3');
  });
  test('Should accept a valid CPE with a version number including +release', async () => {
    const response = getVersion(cpes.betaVersionPlus);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.9.3');
  });
  test("Should accept a valid CPE with a nuber in it's name", async () => {
    const response = getVersion(cpes.withNumbersWithVersion);
    expect(typeof response).toBe('string');
    expect(response).toBe('5.1.5');
  });
  test("Should accept a valid CPE with a nuber in it's name & without a version", async () => {
    const response = getVersion(cpes.withNumbersWithoutVersion);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.0.0');
  });
  test('Should return 0.0.0 for invalid cpes', async () => {
    const response = getVersion(cpes.invalidCpe);
    expect(typeof response).toBe('string');
    expect(response).toBe('0.0.0');
  });
});

describe('previousCpeVersion', () => {
  const cpes = {
    'opensslV3.1.2': 'cpe:2.3:a:openssl:openssl:3.1.2:*:*:*:*:*:*:*',
    opensslNoVersion: 'cpe:2.3:a:openssl:openssl:-:*:*:*:*:*:*:*',
    'opensslV3.1.1': 'cpe:2.3:a:openssl:openssl:3.1.1:*:*:*:*:*:*:*',
    'opensslV3.0.2': 'cpe:2.3:a:openssl:openssl:3.0.2:*:*:*:*:*:*:*',
    'opensslV2.1.2': 'cpe:2.3:a:openssl:openssl:3.0.2:*:*:*:*:*:*:*',
  };

  test('Should identify previous versions', async () => {
    expect(
      previousCpeVersion(cpes['opensslV3.1.2'], cpes['opensslV3.1.1']),
    ).toBe(true);
    expect(
      previousCpeVersion(cpes['opensslV3.1.2'], cpes['opensslV3.0.2']),
    ).toBe(true);
    expect(
      previousCpeVersion(cpes['opensslV3.1.2'], cpes['opensslV2.1.2']),
    ).toBe(true);
    expect(
      previousCpeVersion(cpes['opensslV3.1.2'], cpes.opensslNoVersion),
    ).toBe(true);
  });
  test('Should identify future versions', async () => {
    expect(
      previousCpeVersion(cpes['opensslV3.1.1'], cpes['opensslV3.1.2']),
    ).toBe(false);
    expect(
      previousCpeVersion(cpes['opensslV3.0.2'], cpes['opensslV3.1.2']),
    ).toBe(false);
    expect(
      previousCpeVersion(cpes['opensslV2.1.2'], cpes['opensslV3.1.2']),
    ).toBe(false);
    expect(
      previousCpeVersion(cpes.opensslNoVersion, cpes['opensslV3.1.2']),
    ).toBe(false);
  });
});
