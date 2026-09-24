import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { useAuth } from "../hooks/useAuth";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

function wrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

async function renderAuth() {
  const view = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(view.result.current.isLoading).toBe(false));
  return view;
}

describe("AuthContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([]);
  });

  it("starts unauthenticated when nothing is stored", async () => {
    const { result } = await renderAuth();

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("rejects login when the backend refuses the credentials", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 401,
          json: { error: { message: "Identifiants invalides." } },
        }),
      },
    ]);
    const { result } = await renderAuth();

    let response;
    await act(async () => {
      response = await result.current.login({
        email: "kevin@example.com",
        password: "wrong",
      });
    });

    expect(response).toEqual({
      success: false,
      error: "Identifiants invalides.",
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("logs in and stores the returned session", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 200,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
    ]);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login({
        email: DEMO_USER.email,
        password: "azerty123",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.pseudo).toBe("kevintech");

    const stored = JSON.parse(window.localStorage.getItem("antunes-auth"));
    expect(stored.token).toBe(FAKE_TOKEN);
    expect(stored.user.email).toBe(DEMO_USER.email);
  });

  it("rejects signup when passwords don't match, without calling the API", async () => {
    const { result } = await renderAuth();

    let response;
    await act(async () => {
      response = await result.current.signup({
        firstName: "Kevin",
        lastName: "Da Cruz",
        username: "kevintech",
        email: "kevin@example.com",
        password: "azerty123",
        confirmPassword: "different",
      });
    });

    expect(response.success).toBe(false);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("signs up successfully with matching passwords", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/signup$/,
        handler: () => ({
          status: 201,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
    ]);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.signup({
        firstName: "Kevin",
        lastName: "Da Cruz",
        username: "kevintech",
        email: "kevin@example.com",
        password: "azerty123",
        confirmPassword: "azerty123",
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user.pseudo).toBe("kevintech");
  });

  it("clears the session on logout", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 200,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
    ]);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login({
        email: DEMO_USER.email,
        password: "azerty123",
      });
    });
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem("antunes-auth")).toBeNull();
  });

  it("merges profile updates returned by the API", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 200,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
      {
        method: "PATCH",
        pattern: /^\/users\/me$/,
        handler: ({ body }) => ({
          status: 200,
          json: { user: { ...DEMO_USER, ...body } },
        }),
      },
    ]);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login({
        email: DEMO_USER.email,
        password: "azerty123",
      });
    });
    await act(async () => {
      await result.current.updateProfile({ address: "1 rue de Paris" });
    });

    expect(result.current.user.address).toBe("1 rue de Paris");
    expect(result.current.user.email).toBe(DEMO_USER.email);
  });

  it("changes the password through the API", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/login$/,
        handler: () => ({
          status: 200,
          json: { user: DEMO_USER, token: FAKE_TOKEN },
        }),
      },
      {
        method: "PATCH",
        pattern: /^\/users\/me\/password$/,
        handler: () => ({ status: 200, json: { success: true } }),
      },
    ]);
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.login({
        email: DEMO_USER.email,
        password: "azerty123",
      });
    });

    let response;
    await act(async () => {
      response = await result.current.changePassword({
        currentPassword: "azerty123",
        newPassword: "newpassword456",
      });
    });

    expect(response.success).toBe(true);
  });

  it("requests a password reset email", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/forgot-password$/,
        handler: () => ({
          status: 200,
          json: { message: "Si un compte existe..." },
        }),
      },
    ]);
    const { result } = await renderAuth();

    let response;
    await act(async () => {
      response = await result.current.forgotPassword("kevin@example.com");
    });

    expect(response.success).toBe(true);
    expect(response.message).toBe("Si un compte existe...");
  });

  it("resets the password with a token", async () => {
    globalThis.fetch = createApiMock([
      {
        method: "POST",
        pattern: /^\/auth\/reset-password$/,
        handler: () => ({ status: 200, json: { success: true } }),
      },
    ]);
    const { result } = await renderAuth();

    let response;
    await act(async () => {
      response = await result.current.resetPassword({
        token: "raw-token",
        password: "newpassword456",
      });
    });

    expect(response.success).toBe(true);
  });
});
