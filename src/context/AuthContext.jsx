import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { useIsClient } from "../hooks/useIsClient";
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
  const isClient = useIsClient();

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
      } catch (error) {
        // Seul un jeton refusé (401) met fin à la session. Une API en veille
        // ou momentanément indisponible ne doit pas déconnecter l'utilisateur.
        if (error.status === 401) {
          setSession(null);
        }
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

  async function changePassword({ currentPassword, newPassword }) {
    if (!session) {
      return { success: false, error: "Non connecté." };
    }

    try {
      await apiRequest("/users/me/password", {
        method: "PATCH",
        body: { currentPassword, newPassword },
        token: session.token,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  async function forgotPassword(email) {
    try {
      const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  async function resetPassword({ token, password }) {
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: { token, password },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  // Le lien de confirmation peut être ouvert sans être connecté (autre
  // appareil, session expirée) : on ne met à jour le profil local que si
  // une session est ouverte.
  async function verifyEmail(verificationToken) {
    try {
      await apiRequest("/auth/verify-email", {
        method: "POST",
        body: { token: verificationToken },
      });
      setSession((current) =>
        current
          ? { ...current, user: { ...current.user, emailVerified: true } }
          : current,
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  async function resendVerificationEmail() {
    try {
      const data = await apiRequest("/auth/resend-verification", {
        method: "POST",
        token: session?.token,
      });
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  async function deleteAccount(password) {
    try {
      await apiRequest("/users/me", {
        method: "DELETE",
        body: { password },
        token: session?.token,
      });
      setSession(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: toFormError(error) };
    }
  }

  // Une page pré-rendue est générée pour un visiteur anonyme : la session
  // enregistrée n'est exposée qu'après l'hydratation.
  const visibleSession = isClient ? session : null;

  const value = {
    user: visibleSession?.user ?? null,
    token: visibleSession?.token ?? null,
    isAuthenticated: Boolean(visibleSession?.user),
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
