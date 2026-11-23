import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Le module garde en mémoire le fait que le script soit déjà chargé :
// on le réimporte à neuf dans chaque test.
async function importAnalytics() {
  vi.resetModules();
  return import("./analytics.js");
}

describe("analytics", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    delete window.dataLayer;
    delete window.gtag;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does nothing when no measurement id is configured", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    const { initAnalytics, isAnalyticsConfigured } = await importAnalytics();

    initAnalytics();

    expect(isAnalyticsConfigured()).toBe(false);
    expect(document.querySelectorAll("script")).toHaveLength(0);
  });

  it("injects the gtag script when a measurement id is configured", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    const { initAnalytics } = await importAnalytics();

    initAnalytics();

    const script = document.querySelector("script");
    expect(script.src).toContain("G-TEST123");
    expect(window.dataLayer.length).toBeGreaterThan(0);
  });

  it("loads the script only once", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    const { initAnalytics } = await importAnalytics();

    initAnalytics();
    initAnalytics();

    expect(document.querySelectorAll("script")).toHaveLength(1);
  });

  it("stops tracking and removes Google cookies when consent is withdrawn", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    const { disableAnalytics } = await importAnalytics();
    document.cookie = "_ga=GA1.1.123; path=/";
    document.cookie = "antunes-other=keep; path=/";

    disableAnalytics();

    expect(window["ga-disable-G-TEST123"]).toBe(true);
    expect(document.cookie).not.toContain("_ga=");
    expect(document.cookie).toContain("antunes-other=keep");
  });
});
