import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readConsent, saveConsent } from "./cookieConsent";

describe("cookieConsent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null while the user has not chosen yet", () => {
    expect(readConsent()).toBeNull();
  });

  it("remembers the user's choice", () => {
    saveConsent({ analytics: true });

    expect(readConsent().analytics).toBe(true);
  });

  it("forgets a choice older than 6 months so the banner asks again", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01"));
    saveConsent({ analytics: false });

    vi.setSystemTime(new Date("2026-07-15"));

    expect(readConsent()).toBeNull();
  });

  it("ignores a corrupted stored value", () => {
    window.localStorage.setItem("antunes-cookie-consent", "{not json");

    expect(readConsent()).toBeNull();
  });
});
