import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="/images/logo.png" alt="Antunes Logo" className="navbar-logo-img" />
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
          <form className="d-flex mx-auto" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Rechercher un produit..."
              aria-label="Search"
              style={{ minWidth: "300px" }}
            />
            <button className="btn btn-outline-primary" type="submit">
              Rechercher
            </button>
          </form>

          <div className="d-flex">
            <Link to="/login" className="btn btn-outline-primary me-2">
              Connexion
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
