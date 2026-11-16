import { describe, it, expect } from "vitest";
import { expiryLabel } from "./store";
describe("expiry", () => {
  it("one day left is flagged as tomorrow (notification threshold)", () => {
    expect(expiryLabel(1)).toBe("Går ut imorgon");
  });
});
