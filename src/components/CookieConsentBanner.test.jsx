import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Layout from "./Layout";
import { readConsent } from "../utils/cookieConsent";

function renderLayout() {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [{ index: true, element: <p>Page enfant</p> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>,
  );
}

describe("Cookie consent banner", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.head.innerHTML = "";
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("asks for consent on the first visit without loading Google Analytics", () => {
    renderLayout();

    expect(
      screen.getByRole("dialog", { name: "Tes choix concernant les cookies" }),
    ).toBeInTheDocument();
    expect(
      document.querySelector("script[src*='googletagmanager']"),
    ).toBeNull();
  });

  it("offers refusing as easily as accepting", () => {
    renderLayout();

    expect(screen.getByRole("button", { name: "Tout refuser" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Tout accepter" })).toBeVisible();
  });

  it("loads Google Analytics only after the user accepts", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Tout accepter" }));

    expect(readConsent().analytics).toBe(true);
    expect(
      document.querySelector("script[src*='googletagmanager']"),
    ).not.toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("records a refusal and never loads Google Analytics", async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole("button", { name: "Tout refuser" }));

    expect(readConsent().analytics).toBe(false);
    expect(
      document.querySelector("script[src*='googletagmanager']"),
    ).toBeNull();
  });

  it("can be reopened from the footer to change one's mind", async () => {
    const user = userEvent.setup();
    renderLayout();
    await user.click(screen.getByRole("button", { name: "Tout refuser" }));

    await user.click(screen.getByRole("button", { name: "Gérer les cookies" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("is not shown again once the user has chosen", () => {
    window.localStorage.setItem(
      "antunes-cookie-consent",
      JSON.stringify({ analytics: false, decidedAt: new Date().toISOString() }),
    );

    renderLayout();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is not needed when no analytics tool is configured", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");

    renderLayout();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Gérer les cookies" }),
    ).not.toBeInTheDocument();
  });
});
