import { fetchHistoricalCVEs } from "../src/get-historical-cves.mjs";
import { describe, test, expect } from "@jest/globals";

describe("fetchHistoricalCpes", () => {
  test("should return an array of json objects", async () => {
    const result = await fetchHistoricalCVEs("CVE-2022-0934");

    const isValid = result.every((item) => {
      return (
        typeof item.cveId === "string" &&
          typeof item.cveChangedId === "string" &&
          typeof item.created === "string" &&
          Array.isArray(item.newCWEId),
        Array.isArray(item.oldCWEId)
      );
    });

    // expect the correct data types
    expect(isValid).toBe(true);
  });
});
