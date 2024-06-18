import { getNameDay } from "src/api/name-day";

describe("getNameDay", () => {
  it("Should fetch the name day data in a proper format", async () => {
    const testDate = new Date();
    await expect(getNameDay(testDate)).resolves.not.toThrow();
  });
});
