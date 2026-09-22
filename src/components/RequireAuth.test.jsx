import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import RequireAuth from "./RequireAuth";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

function renderProtectedRouter(initialPath = "/protected") {
  const router = createMemoryRouter(
    [
      {
        element: <RequireAuth />,
        children: [
          { path: "/protected", element: <div>Contenu protégé</div> },
        ],
      },
      { path: "/login", element: <div>Page de connexion</div> },
    ],
    { initialEntries: [initialPath] },
  );

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}

describe("RequireAuth", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    window.localStorage.clear();
  });

  it("lets anyone through in dev mode, even when logged out", () => {
    vi.stubEnv("DEV", true);
    window.localStorage.clear();
    globalThis.fetch = createApiMock([]);

    renderProtectedRouter();

    expect(screen.getByText("Contenu protégé")).toBeInTheDocument();
  });

  it("redirects to /login outside dev mode when logged out", () => {
    vi.stubEnv("DEV", false);
    window.localStorage.clear();
    globalThis.fetch = createApiMock([]);

    renderProtectedRouter();

    expect(screen.getByText("Page de connexion")).toBeInTheDocument();
  });

  it("lets an authenticated user through outside dev mode", async () => {
    vi.stubEnv("DEV", false);
    window.localStorage.setItem(
      "antunes-auth",
      JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
    );
    globalThis.fetch = createApiMock([
      {
        method: "GET",
        pattern: /^\/auth\/me$/,
        handler: () => ({ status: 200, json: { user: DEMO_USER } }),
      },
    ]);

    renderProtectedRouter();

    expect(await screen.findByText("Contenu protégé")).toBeInTheDocument();
  });
});
