import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import { createApiMock } from "./mockApi";
import { DEMO_PRODUCTS } from "./fixtures";
import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Sell from "../pages/Sell";
import Favorites from "../pages/Favorites";
import Messages from "../pages/Messages";
import Account from "../pages/Account";

const PAGES = [
  { name: "Home", element: <Home />, path: "/" },
  { name: "Catalog", element: <Catalog />, path: "/catalog" },
  {
    name: "ProductDetails",
    element: <ProductDetails />,
    path: `/product/${DEMO_PRODUCTS[0]._id}`,
  },
  { name: "Login", element: <Login />, path: "/login" },
  { name: "Signup", element: <Signup />, path: "/signup" },
  { name: "Sell", element: <Sell />, path: "/sell" },
  { name: "Favorites", element: <Favorites />, path: "/favorites" },
  { name: "Messages", element: <Messages />, path: "/messages" },
  { name: "Account", element: <Account />, path: "/account" },
];

let errorSpy;
let warnSpy;

beforeEach(() => {
  window.localStorage.clear();
  globalThis.fetch = createApiMock([
    {
      method: "GET",
      pattern: /^\/products$/,
      handler: () => ({ status: 200, json: { products: DEMO_PRODUCTS } }),
    },
  ]);
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
  warnSpy.mockRestore();
});

describe("console warnings", () => {
  for (const page of PAGES) {
    it(`${page.name} renders without console.error or console.warn`, async () => {
      const router = createMemoryRouter(
        [{ path: page.path, element: page.element }],
        { initialEntries: [page.path] },
      );

      render(
        <HelmetProvider>
          <AuthProvider>
            <ProductsProvider>
              <RouterProvider router={router} />
            </ProductsProvider>
          </AuthProvider>
        </HelmetProvider>,
      );

      // Laisse le temps aux appels API simulés (asynchrones) de se résoudre
      // et aux composants de se mettre à jour avant de vérifier la console.
      await act(async () => {
        await Promise.resolve();
      });

      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  }
});
