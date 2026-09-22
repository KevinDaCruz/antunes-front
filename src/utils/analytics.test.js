import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("initAnalytics", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    delete window.dataLayer;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("does nothing when no measurement id is configured", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    const { initAnalytics } = await import("./analytics.js");

    initAnalytics();

    expect(document.querySelectorAll("script")).toHaveLength(0);
  });

  it("injects the gtag script when a measurement id is configured", async () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
    const { initAnalytics } = await import("./analytics.js");

    initAnalytics();

    const script = document.querySelector("script");
    expect(script.src).toContain("G-TEST123");
    expect(window.dataLayer.length).toBeGreaterThan(0);
  });
});
