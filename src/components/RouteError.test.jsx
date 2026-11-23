import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import RouteError from "./RouteError";

function renderFailingRoute(error) {
  function Failing() {
    throw error;
  }

  const router = createMemoryRouter([
    { path: "/", element: <Failing />, errorElement: <RouteError /> },
  ]);

  return render(<RouterProvider router={router} />);
}

describe("RouteError", () => {
  it("asks to reload when the page belongs to a previous deployment", () => {
    renderFailingRoute(
      new TypeError(
        "Failed to fetch dynamically imported module: /assets/Signup.js",
      ),
    );

    expect(
      screen.getByRole("heading", {
        name: "Une nouvelle version d'Antunes est disponible",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Recharger la page" }),
    ).toBeInTheDocument();
  });

  it("shows a generic French message for any other error", () => {
    renderFailingRoute(new Error("boom"));

    expect(
      screen.getByRole("heading", {
        name: "Une erreur inattendue est survenue",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Retour à l'accueil" }),
    ).toHaveAttribute("href", "/");
  });
});
