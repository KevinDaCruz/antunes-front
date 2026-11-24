import { describe, expect, it } from "vitest";
import { computeBuyerTotal } from "./serviceFee";

describe("computeBuyerTotal", () => {
  it("adds 5 % + 0.70 € like the API does", () => {
    expect(computeBuyerTotal(110)).toBe(116.2);
    expect(computeBuyerTotal(950)).toBe(998.2);
  });
});
