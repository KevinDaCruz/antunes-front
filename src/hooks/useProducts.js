import { useContext } from "react";
import { ProductsContext } from "../context/products-context";

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error(
      "useProducts doit être utilisé à l'intérieur d'un ProductsProvider",
    );
  }

  return context;
}
