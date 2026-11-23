import { beforeEach, describe, expect, it, vi } from "vitest";
import { isStaleBuildError, reloadOnceForNewBuild } from "./staleBuild";

describe("staleBuild", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("recognises a missing chunk in Chrome, Firefox and Safari", () => {
    expect(
      isStaleBuildError(
        new TypeError(
          "Failed to fetch dynamically imported module: /assets/Signup.js",
        ),
      ),
    ).toBe(true);
    expect(
      isStaleBuildError(
        new TypeError("error loading dynamically imported module"),
      ),
    ).toBe(true);
    expect(
      isStaleBuildError(new TypeError("Importing a module script failed.")),
    ).toBe(true);
    expect(isStaleBuildError(new Error("Produit introuvable."))).toBe(false);
  });

  it("reloads only once in a short period to avoid a reload loop", () => {
    const reload = vi.fn();

    expect(reloadOnceForNewBuild(reload)).toBe(true);
    expect(reloadOnceForNewBuild(reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
