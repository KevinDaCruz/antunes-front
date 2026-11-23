import { describe, expect, it } from "vitest";
import { isPasswordValid } from "./passwordRules";

describe("isPasswordValid", () => {
  it("accepts a password that follows every CNIL rule", () => {
    expect(isPasswordValid("Azerty-2026!x")).toBe(true);
  });

  it.each([
    ["too short", "Az-26!x"],
    ["no uppercase", "azerty-2026!x"],
    ["no lowercase", "AZERTY-2026!X"],
    ["no digit", "Azerty-deux!x"],
    ["no special character", "Azerty2026xyz"],
  ])("rejects a password with %s", (_label, password) => {
    expect(isPasswordValid(password)).toBe(false);
  });
});
