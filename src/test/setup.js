import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// jsdom ne fournit pas matchMedia : on simule une préférence "clair" par défaut
// pour que useThemePreference (et tout composant qui en dépend) puisse monter.
window.matchMedia =
  window.matchMedia ||
  function matchMediaStub(query) {
    return {
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    };
  };

afterEach(() => {
  cleanup();
});
