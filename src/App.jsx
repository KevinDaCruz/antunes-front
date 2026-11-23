import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import PageLoader from "./components/PageLoader";
import RouteError from "./components/RouteError";
import { AuthProvider } from "./context/AuthContext";
import { ProductsProvider } from "./context/ProductsContext";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Sell = lazy(() => import("./pages/Sell"));
const Catalog = lazy(() => import("./pages/Catalog"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Messages = lazy(() => import("./pages/Messages"));
const Account = lazy(() => import("./pages/Account"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("./pages/PaymentCancelled"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const LegalNotice = lazy(() => import("./pages/LegalNotice"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const PrivacyRequest = lazy(() => import("./pages/PrivacyRequest"));
const NotFound = lazy(() => import("./pages/NotFound"));

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteError />,
    children: [
      {
        // Une erreur dans une page s'affiche entre l'en-tête et le pied de page.
        errorElement: <RouteError />,
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
            path: "/forgot-password",
            element: withSuspense(<ForgotPassword />),
          },
          {
            path: "/reset-password",
            element: withSuspense(<ResetPassword />),
          },
          {
            path: "/verify-email",
            element: withSuspense(<VerifyEmail />),
          },
          {
            path: "/mentions-legales",
            element: withSuspense(<LegalNotice />),
          },
          {
            path: "/confidentialite",
            element: withSuspense(<PrivacyPolicy />),
          },
          {
            path: "/mes-donnees",
            element: withSuspense(<PrivacyRequest />),
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
              {
                path: "/payment-success",
                element: withSuspense(<PaymentSuccess />),
              },
              {
                path: "/payment-cancelled",
                element: withSuspense(<PaymentCancelled />),
              },
            ],
          },
          {
            path: "*",
            element: withSuspense(<NotFound />),
          },
        ],
      },
    ],
  },
]);

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
