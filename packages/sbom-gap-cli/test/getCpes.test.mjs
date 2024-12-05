import { describe, test, expect } from '@jest/globals';
import { getCpes } from '../src/get-syft-cpes.mjs';

describe('getCpes', () => {
  test('should return a list of CPEs', async () => {
    const jsonData = {
      bomFormat: 'CycloneDX',
      components: [
        {
          cpe: 'cpe:/a:busybox:busybox:1.33.2',
          group: '',
          licenses: [
            {
              license: {
                name: 'GPL-2.0-or-later',
              },
            },
          ],
          name: 'busybox',
          supplier: {
            name: 'Organization: OpenWrt ()',
          },
          type: 'application',
          version: '1.33.2',
        },
        {
          cpe: 'cpe:/a:thekelleys:dnsmasq:2.85',
          group: '',
          licenses: [
            {
              license: {
                name: 'GPL-2.0',
              },
            },
          ],
          name: 'dnsmasq',
          supplier: {
            name: 'Organization: OpenWrt ()',
          },
          type: 'application',
          version: '2.85',
        },
      ],
    };

    const result = await getCpes(jsonData);
    const expectedOutput = [
      'cpe:2.3:a:busybox:busybox:1.33.2',
      'cpe:2.3:a:thekelleys:dnsmasq:2.85',
    ];
    // expect CPEs in CPE2.3 format
    expect(result).toEqual(expectedOutput);
  });
});
