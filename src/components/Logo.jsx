import { Link } from "react-router-dom";

// Sur le fond noir du pied de page, le nom passe en crème.
function Logo({ onDark = false }) {
  return (
    <Link
      to="/"
      className="inline-flex shrink-0 items-center"
      aria-label="Antunes, accueil"
    >
      <img
        src={
          onDark ? "/brand/antunes-logo-sombre.svg" : "/brand/antunes-logo.svg"
        }
        alt=""
        width="160"
        height="42"
        // Le logo du pied de page n'est jamais visible au chargement.
        loading={onDark ? "lazy" : undefined}
        className="h-10 w-auto"
      />
    </Link>
  );
}

export default Logo;
