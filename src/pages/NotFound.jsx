import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <SeoHead
        title="Page introuvable"
        description="Cette page n'existe pas ou a été déplacée."
        noIndex
      />

      <p className="text-[8rem] leading-none font-black tracking-tighter">
        404
      </p>
      <h1 className="mb-4 text-4xl md:text-5xl">Page introuvable</h1>
      <p className="mb-8 text-lg font-semibold text-ink-soft">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-white">
          Accueil
        </Link>
        <Link to="/catalog" className="btn-pink">
          Voir le catalogue
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
