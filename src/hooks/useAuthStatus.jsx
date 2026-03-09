import { useEffect, useState } from "react";

const AUTH_STORAGE_KEYS = [
  "antunes-auth-token",
  "authToken",
  "token",
  "antunes-user",
  "user",
  "isAuthenticated",
];

function readIsAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return AUTH_STORAGE_KEYS.some((key) => {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return false;
    }

    return value !== "false" && value !== "0";
  });
}

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(readIsAuthenticated);

  useEffect(() => {
    function refreshAuthStatus() {
      setIsAuthenticated(readIsAuthenticated());
    }

    window.addEventListener("storage", refreshAuthStatus);
    window.addEventListener("focus", refreshAuthStatus);

    return () => {
      window.removeEventListener("storage", refreshAuthStatus);
      window.removeEventListener("focus", refreshAuthStatus);
    };
  }, []);

  return { isAuthenticated };
}
