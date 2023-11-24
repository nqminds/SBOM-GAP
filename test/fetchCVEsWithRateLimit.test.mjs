import { fetchCVEsWithRateLimit } from "../src/list-vulnerabilities.mjs";
import { describe, test, expect } from "@jest/globals";

describe("fetchCVEsWithRateLimit", () => {
  test("should return an object with array values", async () => {
    const sbomData = {
      bomFormat: "CycloneDX",
      components: [
        {
          cpe: "cpe:/a:busybox:busybox:1.33.2",
          group: "",
          licenses: [
            {
              license: {
                name: "GPL-2.0-or-later",
              },
            },
          ],
          name: "busybox",
          supplier: {
            name: "Organization: OpenWrt ()",
          },
          type: "application",
          version: "1.33.2",
        },
        {
          cpe: "cpe:/a:thekelleys:dnsmasq:2.85",
          group: "",
          licenses: [
            {
              license: {
                name: "GPL-2.0",
              },
            },
          ],
          name: "dnsmasq",
          supplier: {
            name: "Organization: OpenWrt ()",
          },
          type: "application",
          version: "2.85",
        },
      ],
    };

    const data = await fetchCVEsWithRateLimit(sbomData);

    // Check if data is an object
    expect(typeof data).toBe("object");
    expect(Array.isArray(data)).toBe(false);

    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(data)) {
      // Check if the value is an array
      expect(Array.isArray(value)).toBe(true);
    }
  });
});
