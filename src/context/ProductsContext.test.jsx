import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";
import { ProductsProvider } from "./ProductsContext";
import { useProducts } from "../hooks/useProducts";
import { createApiMock } from "../test/mockApi";
import { DEMO_PRODUCTS, DEMO_USER, FAKE_TOKEN } from "../test/fixtures";

function wrapper({ children }) {
  return (
    <AuthProvider>
      <ProductsProvider>{children}</ProductsProvider>
    </AuthProvider>
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

const listProductsRoute = {
  method: "GET",
  pattern: /^\/products$/,
  handler: () => ({ status: 200, json: { products: DEMO_PRODUCTS } }),
};

async function renderProducts() {
  const view = renderHook(() => useProducts(), { wrapper });
  await waitFor(() => expect(view.result.current.isLoadingProducts).toBe(false));
  return view;
}

describe("ProductsContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("loads the product catalogue on mount", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);

    const { result } = await renderProducts();

    expect(result.current.products).toHaveLength(DEMO_PRODUCTS.length);
    expect(result.current.products[0].name).toBe("iPhone 15 Pro");
  });

  it("has no favorites when logged out", async () => {
    globalThis.fetch = createApiMock([listProductsRoute]);

    const { result } = await renderProducts();

    expect(result.current.favoriteProducts).toEqual([]);
    expect(result.current.isFavorite("product-1")).toBe(false);
  });

  it("adds a new product via the API and prepends it locally", async () => {
    const newProduct = { ...DEMO_PRODUCTS[0], _id: "product-3", name: "Manette Xbox" };
    globalThis.fetch = createApiMock([
      listProductsRoute,
      {
        method: "POST",
        pattern: /^\/products$/,
        handler: () => ({ status: 201, json: { product: newProduct } }),
      },
    ]);

    const { result } = await renderProducts();

    let created;
    await act(async () => {
      created = await result.current.addProduct({ name: "Manette Xbox" });
    });

    expect(created.name).toBe("Manette Xbox");
    expect(result.current.products[0].name).toBe("Manette Xbox");
  });

  it("loads favorites for an authenticated user", async () => {
    seedAuthenticatedSession();
    globalThis.fetch = createApiMock([
      meRoute,
      listProductsRoute,
      {
        method: "GET",
        pattern: /^\/favorites$/,
        handler: () => ({
          status: 200,
          json: { products: [DEMO_PRODUCTS[0]] },
        }),
      },
    ]);

    const { result } = await renderProducts();

    await waitFor(() =>
      expect(result.current.favoriteProducts).toHaveLength(1),
    );
    expect(result.current.isFavorite("product-1")).toBe(true);
    expect(result.current.isFavorite("product-2")).toBe(false);
  });

  it("toggles a favorite on and off through the API", async () => {
    seedAuthenticatedSession();
    let isFavorited = false;

    globalThis.fetch = createApiMock([
      meRoute,
      listProductsRoute,
      {
        method: "GET",
        pattern: /^\/favorites$/,
        handler: () => ({
          status: 200,
          json: { products: isFavorited ? [DEMO_PRODUCTS[0]] : [] },
        }),
      },
      {
        method: "POST",
        pattern: /^\/favorites\/product-1$/,
        handler: () => {
          isFavorited = true;
          return { status: 204 };
        },
      },
      {
        method: "DELETE",
        pattern: /^\/favorites\/product-1$/,
        handler: () => {
          isFavorited = false;
          return { status: 204 };
        },
      },
    ]);

    const { result } = await renderProducts();
    await waitFor(() => expect(result.current.favoriteProducts).toEqual([]));

    await act(async () => {
      await result.current.toggleFavorite("product-1");
    });
    await waitFor(() => expect(result.current.isFavorite("product-1")).toBe(true));

    await act(async () => {
      await result.current.toggleFavorite("product-1");
    });
    await waitFor(() => expect(result.current.isFavorite("product-1")).toBe(false));
  });
});
