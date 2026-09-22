import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useThemePreference } from "./useThemePreference";

describe("useThemePreference", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to light when nothing is stored", () => {
    const { result } = renderHook(() => useThemePreference());

    expect(result.current.isDarkMode).toBe(false);
  });

  it("reads a previously stored theme", () => {
    window.localStorage.setItem("antunes-theme", "dark");

    const { result } = renderHook(() => useThemePreference());

    expect(result.current.isDarkMode).toBe(true);
  });

  it("toggles the theme and reflects it on <html> and localStorage", () => {
    const { result } = renderHook(() => useThemePreference());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.isDarkMode).toBe(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(window.localStorage.getItem("antunes-theme")).toBe("dark");
  });
});
