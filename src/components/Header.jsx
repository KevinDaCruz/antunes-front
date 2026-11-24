import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BadgeEuro,
  Heart,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Search,
  Store,
  X,
} from "lucide-react";
import { HEADER_CATEGORIES } from "../constants/navigation";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";
import { initials } from "../utils/initials";

const ICON_BUTTON =
  "grid size-11 place-items-center rounded-(--radius-btn) border-2 border-ink bg-white text-ink transition hover:bg-yellow";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearchSubmit(event) {
    event.preventDefault();
    setIsMenuOpen(false);

    const trimmedValue = searchValue.trim();
    navigate(
      trimmedValue
        ? `/catalog?search=${encodeURIComponent(trimmedValue)}`
        : "/catalog",
    );
  }

  function handleLogoutClick() {
    setIsMenuOpen(false);
    logout();
    navigate("/");
  }

  const searchForm = (id) => (
    <form className="relative" role="search" onSubmit={handleSearchSubmit}>
      <label htmlFor={id} className="sr-only">
        Rechercher une annonce
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        placeholder="iPhone 15, RTX 4070, PS5…"
        className="field !pr-28 !pl-12"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <button
        type="submit"
        className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg bg-ink px-3 py-2 text-sm font-extrabold text-cream hover:bg-ink-soft"
      >
        Rechercher
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b-3 border-ink bg-ink text-cream">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-6 py-2 text-[13px] font-bold">
          <span className="flex items-center gap-1.5">
            <LockKeyhole className="size-4 text-yellow" aria-hidden="true" />
            Paiement sécurisé par Stripe
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <BadgeEuro className="size-4 text-yellow" aria-hidden="true" />
            Prix total affiché avant l'achat
          </span>
          <span className="hidden items-center gap-1.5 md:flex">
            <Store className="size-4 text-yellow" aria-hidden="true" />
            Publication d'annonce gratuite
          </span>
        </div>
      </div>

      <div className="border-b-3 border-ink bg-cream">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4 lg:gap-6">
          <Logo />

          <div className="hidden flex-1 md:block">
            {searchForm("header-search")}
          </div>

          <nav
            className="ml-auto flex items-center gap-2 md:ml-0"
            aria-label="Navigation principale"
          >
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `${ICON_BUTTON} hidden sm:grid ${isActive ? "!bg-yellow !text-ink" : ""}`
              }
              aria-label="Favoris"
            >
              <Heart className="size-5" aria-hidden="true" />
            </NavLink>
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `${ICON_BUTTON} hidden sm:grid ${isActive ? "!bg-yellow !text-ink" : ""}`
              }
              aria-label="Messages"
            >
              <MessageCircle className="size-5" aria-hidden="true" />
            </NavLink>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="grid size-11 place-items-center rounded-full border-2 border-ink bg-yellow text-sm font-black text-ink"
                >
                  <span aria-hidden="true">{initials(user)}</span>
                  <span className="sr-only">Mon compte</span>
                </Link>
                <button
                  type="button"
                  className={`${ICON_BUTTON} hidden lg:grid`}
                  onClick={handleLogoutClick}
                  aria-label="Déconnexion"
                >
                  <LogOut className="size-5" aria-hidden="true" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-(--radius-btn) px-3 py-2.5 text-[15px] font-extrabold hover:bg-white md:inline-flex"
              >
                Se connecter
              </Link>
            )}

            <Link to="/sell" className="btn-pink hidden sm:inline-flex">
              <Plus className="size-4.5" aria-hidden="true" />
              Vendre
            </Link>

            <button
              type="button"
              className={`${ICON_BUTTON} md:hidden`}
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </nav>
        </div>

        <nav
          className="mx-auto hidden max-w-7xl gap-1 overflow-x-auto px-5 pb-3 md:flex"
          aria-label="Catégories"
        >
          {HEADER_CATEGORIES.slice(0, 10).map((category) => (
            <Link
              key={category}
              to={`/catalog?category=${encodeURIComponent(category)}`}
              className="shrink-0 rounded-full border-2 border-transparent px-3 py-1 text-sm font-bold hover:border-ink hover:bg-white"
            >
              {category}
            </Link>
          ))}
          <Link
            to="/catalog"
            className="shrink-0 rounded-full border-2 border-ink bg-yellow px-3 py-1 text-sm font-extrabold text-ink"
          >
            Tout voir
          </Link>
        </nav>

        {isMenuOpen ? (
          <div
            id="mobile-menu"
            className="space-y-5 border-t-3 border-ink px-6 py-5 md:hidden"
          >
            {searchForm("mobile-search")}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/sell"
                className="btn-pink"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="size-4.5" aria-hidden="true" />
                Vendre
              </Link>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn-white"
                  onClick={handleLogoutClick}
                >
                  Se déconnecter
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Se connecter
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/favorites"
                className="btn-white !px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Favoris
              </Link>
              <Link
                to="/messages"
                className="btn-white !px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {HEADER_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  to={`/catalog?category=${encodeURIComponent(category)}`}
                  className="chip"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
