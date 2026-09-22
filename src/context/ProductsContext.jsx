import { useCallback, useContext, useEffect, useState } from "react";
import { ProductsContext } from "./products-context";
import { AuthContext } from "./auth-context";
import { apiRequest } from "../utils/apiClient";

export function ProductsProvider({ children }) {
  const { token, isAuthenticated } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const data = await apiRequest("/products");
      setProducts(data.products);
      setProductsError("");
    } catch {
      setProductsError("Impossible de charger les annonces pour le moment.");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setFavoriteProducts([]);
      return;
    }

    try {
      const data = await apiRequest("/favorites", { token });
      setFavoriteProducts(data.products);
    } catch {
      setFavoriteProducts([]);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function addProduct(productData) {
    const data = await apiRequest("/products", {
      method: "POST",
      body: productData,
      token,
    });

    setProducts((currentProducts) => [data.product, ...currentProducts]);

    return data.product;
  }

  function isFavorite(productId) {
    return favoriteProducts.some((product) => product._id === productId);
  }

  async function toggleFavorite(productId) {
    if (!isAuthenticated || !token) {
      return;
    }

    try {
      if (isFavorite(productId)) {
        await apiRequest(`/favorites/${productId}`, {
          method: "DELETE",
          token,
        });
      } else {
        await apiRequest(`/favorites/${productId}`, { method: "POST", token });
      }

      await loadFavorites();
    } catch (error) {
      console.error("Impossible de mettre à jour les favoris.", error);
    }
  }

  const value = {
    products,
    isLoadingProducts,
    productsError,
    addProduct,
    favoriteProducts,
    toggleFavorite,
    isFavorite,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
