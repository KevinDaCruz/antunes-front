import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <RouterProvider router={router} />
      </ProductsProvider>
    </AuthProvider>
  );
}

export default App;
