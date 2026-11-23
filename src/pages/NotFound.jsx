import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

function NotFound() {
  return (
    <div className="container my-5 text-center">
      <SeoHead
        title="Page introuvable"
        description="Cette page n'existe pas ou a été déplacée."
        noIndex
      />

      <p className="display-4 fw-bold mb-2">404</p>
      <h1 className="h2 mb-3">Page introuvable</h1>
      <p className="text-muted mb-4">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>

      <div className="d-flex justify-content-center gap-2">
        <Link to="/" className="btn btn-outline-primary">
          Accueil
        </Link>
        <Link to="/catalog" className="btn btn-primary fx-neon">
          Voir le catalogue
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
