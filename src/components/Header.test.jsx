import { beforeEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Header from "./Header";
import { createApiMock } from "../test/mockApi";
import { DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname + location.search}</div>;
}

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Header />
        <LocationDisplay />
      </AuthProvider>
    </MemoryRouter>,
  );
}

function seedAuthenticatedSession() {
  window.localStorage.setItem(
    "antunes-auth",
    JSON.stringify({ token: FAKE_TOKEN, user: DEMO_USER }),
  );
}

const meRoute = {
  method: "GET",
  pattern: /^\/auth\/me$/,
  handler: () => ({ status: 200, json: { user: DEMO_USER } }),
};

describe("Header", () => {
  beforeEach(() => {
    window.localStorage.clear();
    globalThis.fetch = createApiMock([meRoute]);
  });

  it("shows Connexion/Inscription when logged out", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "Connexion" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inscription" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Mon compte" }),
    ).not.toBeInTheDocument();
  });

  it("shows Mon compte/Déconnexion when logged in", async () => {
    seedAuthenticatedSession();

    renderHeader();

    expect(
      await screen.findByRole("link", { name: "Mon compte" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Déconnexion" }),
    ).toBeInTheDocument();
  });

  it("navigates to /catalog with the typed search query", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.type(
      screen.getByPlaceholderText("Rechercher un produit..."),
      "iphone",
    );
    await user.click(screen.getByRole("button", { name: "Rechercher" }));

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/catalog?search=iphone",
    );
  });

  it("links each category to a pre-filtered catalog URL", () => {
    renderHeader();

    const consolesLink = screen.getByRole("link", { name: "Consoles" });
    expect(consolesLink).toHaveAttribute(
      "href",
      "/catalog?category=Consoles",
    );
  });

  it("logs the user out and redirects home", async () => {
    seedAuthenticatedSession();
    const user = userEvent.setup();
    renderHeader();

    await user.click(
      await screen.findByRole("button", { name: "Déconnexion" }),
    );

    expect(window.localStorage.getItem("antunes-auth")).toBeNull();
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });
});
