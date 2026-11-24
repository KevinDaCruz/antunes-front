import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import CookieConsentBanner from "./CookieConsentBanner";
import { readConsent } from "../utils/cookieConsent";
import { isAnalyticsConfigured } from "../utils/analytics";

function Layout() {
  // Sans outil de mesure d'audience configuré, aucun cookie n'est déposé :
  // le bandeau n'a alors pas lieu d'être.
  const [isCookieBannerOpen, setIsCookieBannerOpen] = useState(
    () => isAnalyticsConfigured() && readConsent() === null,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="btn-yellow sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Aller au contenu principal
      </a>

      <Header />

      <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer
        onManageCookies={
          isAnalyticsConfigured()
            ? () => setIsCookieBannerOpen(true)
            : undefined
        }
      />
      <ScrollRestoration />

      {isCookieBannerOpen ? (
        <CookieConsentBanner onClose={() => setIsCookieBannerOpen(false)} />
      ) : null}
    </div>
  );
}

export default Layout;
