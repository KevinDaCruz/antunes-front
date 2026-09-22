import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Layout from "./Layout";

describe("Layout", () => {
  it("renders the header, the routed page and the footer", () => {
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

    render(
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>,
    );

    expect(screen.getByText("Page enfant")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Aller au contenu principal" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
