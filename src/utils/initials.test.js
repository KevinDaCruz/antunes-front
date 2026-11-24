import { describe, expect, it } from "vitest";
import { initials } from "./initials";

describe("initials", () => {
  it("uses the first and last name, then the pseudo", () => {
    expect(initials({ firstName: "Léa", lastName: "Martin" })).toBe("LM");
    expect(initials({ pseudo: "kevintech" })).toBe("KE");
    expect(initials(null)).toBe("?");
  });
});
