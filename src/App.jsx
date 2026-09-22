import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PageLoader from "./components/PageLoader";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Sell = lazy(() => import("./pages/Sell"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Messages = lazy(() => import("./pages/Messages"));
const Account = lazy(() => import("./pages/Account"));

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: withSuspense(<Home />),
      },
      {
        path: "/catalog",
        element: withSuspense(<Catalog />),
      },
      {
        path: "/product/:id",
        element: withSuspense(<ProductDetails />),
      },
      {
        path: "/login",
        element: withSuspense(<Login />),
      },
      {
        path: "/signup",
        element: withSuspense(<Signup />),
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: "/sell",
            element: withSuspense(<Sell />),
          },
          {
            path: "/favorites",
            element: withSuspense(<Favorites />),
          },
          {
            path: "/messages",
            element: withSuspense(<Messages />),
          },
          {
            path: "/account",
            element: withSuspense(<Account />),
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ProductsProvider>
          <RouterProvider router={router} />
        </ProductsProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
