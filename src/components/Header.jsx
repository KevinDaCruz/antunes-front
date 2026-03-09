import { Link } from "react-router-dom";
import {
  HEADER_CATEGORIES,
  HEADER_PRIMARY_LINKS,
} from "../constants/navigation";
import { useThemePreference } from "../hooks/useThemePreference";
import { useAuthStatus } from "../hooks/useAuthStatus";

function Header() {
  const { isDarkMode, toggleTheme } = useThemePreference();
  const { isAuthenticated } = useAuthStatus();

  return (
    <header className="site-header shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-light main-navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src="/images/logo.png"
              alt="Antunes Logo"
              className="navbar-logo-img"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-3 mb-2 mb-lg-0">
              {HEADER_PRIMARY_LINKS.map((link) => (
                <li key={link.to} className="nav-item">
                  <Link to={link.to} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <form className="d-flex mx-auto" role="search">
              <input
                className="form-control me-2 header-search-input"
                type="search"
                placeholder="Rechercher un produit..."
                aria-label="Search"
              />
              <button
                className="btn btn-outline-primary search-button fx-neon"
                type="submit"
              >
                Rechercher
              </button>
            </form>

            <div className="d-flex header-actions">
              <button
                type="button"
                className="btn btn-outline-dark me-2 theme-toggle-btn fx-neon"
                onClick={toggleTheme}
                aria-label="Activer ou désactiver le mode sombre"
              >
                {isDarkMode ? "☀️" : "🌙"}
              </button>
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="btn btn-outline-secondary me-2 fx-neon"
                >
                  Mon compte
                </Link>
              ) : null}
              <Link
                to="/login"
                className="btn btn-outline-primary me-2 fx-neon"
              >
                Connexion
              </Link>
              <Link to="/signup" className="btn btn-primary fx-neon">
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="categories-nav border-top bg-white">
        <div className="container">
          <div className="categories-nav-scroll">
            {HEADER_CATEGORIES.map((category) => (
              <Link
                key={category}
                to="/catalog"
                className="categories-nav-link"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
