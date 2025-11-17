import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sell from "./pages/Sell";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/sell",
        element: <Sell />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
