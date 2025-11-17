import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />

      <main className="container my-4" style={{ flex: "1" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
