import { Outlet, ScrollRestoration } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-to-content-link">
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="app-layout-main" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}

export default Layout;
