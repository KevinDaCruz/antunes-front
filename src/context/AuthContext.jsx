import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { apiRequest, ApiError } from "../utils/apiClient";

const AUTH_STORAGE_KEY = "antunes-auth";

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function toFormError(error) {
  return error instanceof ApiError
    ? error.message
    : "Impossible de contacter le serveur. Réessaie plus tard.";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [session]);

  // Revalide le token au chargement (il peut avoir expiré) et resynchronise
  // le profil avec le serveur.
  useEffect(() => {
    async function refreshSession() {
      const storedSession = readStoredSession();

      if (!storedSession?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me", {
          token: storedSession.token,
        });
        setSession({ token: storedSession.token, user: data.user });
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    refreshSession();
  }, []);

  async function login({ email, password }) {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      setSession({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  async function signup({
    firstName,
    lastName,
    username,
    email,
    password,
    confirmPassword,
  }) {
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Les mots de passe ne correspondent pas.",
      };
    }

    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: { firstName, lastName, pseudo: username, email, password },
      });
      setSession({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  function logout() {
    setSession(null);
  }

  async function updateProfile(updates) {
    if (!session) {
      return { success: false, error: "Non connecté." };
    }

    try {
      const data = await apiRequest("/users/me", {
        method: "PATCH",
        body: updates,
        token: session.token,
      });
      setSession((current) => ({ ...current, user: data.user }));
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.user),
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
