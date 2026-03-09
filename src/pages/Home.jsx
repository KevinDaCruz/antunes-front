import { products } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useCursorSpotlight } from "../hooks/useCursorSpotlight";

function Home() {
  const { elementRef, spotlightHandlers } = useCursorSpotlight({
    resetToCenterOnLeave: false,
  });

  const stats = [
    { value: "12k+", label: "Annonces tech" },
    { value: "4.9/5", label: "Note vendeurs" },
    { value: "24h", label: "Délai moyen de vente" },
  ];

  const featuredCollections = [
    "Setup gaming",
    "Photo & vidéo",
    "Bureautique",
    "Reconditionné premium",
    "Audio pro",
    "Streaming",
  ];

  const steps = [
    {
      title: "Publie ton annonce",
      description:
        "Ajoute tes photos, renseigne l'état, fixe ton prix en 2 minutes.",
    },
    {
      title: "Échange en messagerie",
      description:
        "Discute avec les acheteurs, négocie et valide la vente en confiance.",
    },
    {
      title: "Vends rapidement",
      description:
        "Suis tes demandes et gère tes produits depuis ton espace compte.",
    },
  ];

  return (
    <>
      <section
        ref={elementRef}
        {...spotlightHandlers}
        className="home-hero home-hero-advanced mb-4"
      >
        <div className="container home-hero-grid">
          <div className="home-hero-content">
            <span className="hero-pill">
              Marketplace Tech • Reconditionné & Occasion
            </span>
            <h1 className="display-5 fw-bold">
              La vente tech nouvelle génération.
            </h1>
            <p className="fs-4 hero-subtitle">
              Achète et revends consoles, PC, smartphones et composants sur une
              interface fluide, moderne et pensée pour la confiance.
            </p>

            <div className="home-hero-actions">
              <Link
                to="/sell"
                className="btn btn-primary btn-lg hero-cta-button fx-neon"
              >
                Déposer une annonce
              </Link>
              <Link to="/catalog" className="btn btn-outline-primary btn-lg">
                Explorer le catalogue
              </Link>
            </div>

            <div className="home-hero-badges">
              <span className="hero-badge-item">Paiement sécurisé</span>
              <span className="hero-badge-item">Vendeurs vérifiés</span>
              <span className="hero-badge-item">Support 7j/7</span>
            </div>
          </div>

          <div className="home-hero-showcase">
            <div className="hero-showcase-card hero-showcase-card-main">
              <p className="hero-showcase-label">Produit en tendance</p>
              <h3 className="h5 mb-2">PS5 Slim • Bon état</h3>
              <p className="mb-0 text-muted">
                Livraison rapide • Vendeur vérifié
              </p>
            </div>
            <div className="hero-showcase-card hero-showcase-card-float">
              <p className="hero-showcase-label">Annonce récente</p>
              <h4 className="h6 mb-1">SSD Samsung 980 Pro</h4>
              <span className="fw-semibold text-primary">110€</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-collections mb-4">
        <div className="collections-marquee">
          <div className="collections-track">
            {[0, 1].map((groupIndex) => (
              <div
                key={groupIndex}
                className="collections-group"
                aria-hidden={groupIndex === 1}
              >
                {featuredCollections.map((collection) => (
                  <span
                    key={`${groupIndex}-${collection}`}
                    className="collection-chip"
                  >
                    {collection}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container home-stats mb-4">
        <div className="row g-3">
          {stats.map((stat) => (
            <div key={stat.label} className="col-12 col-md-4">
              <article className="stat-card">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label mb-0">{stat.label}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <div className="container products-section">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
          <h2 className="mb-0">Derniers produits ajoutés</h2>
          <Link to="/catalog" className="btn btn-sm btn-outline-secondary">
            Voir tout
          </Link>
        </div>

        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-4 mb-4">
          <Link
            to="/catalog"
            className="btn btn-outline-primary btn-lg fx-neon"
          >
            Voir plus d'articles
          </Link>
        </div>
      </div>

      <section className="container home-steps-section mb-4">
        <div className="section-heading text-center mb-4">
          <h2 className="mb-2">Comment ça marche ?</h2>
          <p className="text-muted mb-0">
            Un parcours simple, rapide, et pensé pour la revente tech.
          </p>
        </div>

        <div className="row g-3">
          {steps.map((step, index) => (
            <div key={step.title} className="col-12 col-lg-4">
              <article className="step-card">
                <span className="step-index">0{index + 1}</span>
                <h3 className="h5 mt-2">{step.title}</h3>
                <p className="text-muted mb-0">{step.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="container home-highlight mb-4">
        <div className="home-highlight-card">
          <div>
            <p className="home-highlight-label">Focus de la semaine</p>
            <h2 className="h3 mb-2">L’univers gaming est en feu 🎮</h2>
            <p className="text-muted mb-0">
              Consoles, écrans et accessoires partent vite: mets ton annonce en
              avant dès aujourd’hui pour maximiser ta visibilité.
            </p>
          </div>

          <div className="home-highlight-actions">
            <Link to="/sell" className="btn btn-primary fx-neon">
              Booster mon annonce
            </Link>
            <Link to="/catalog" className="btn btn-outline-secondary">
              Voir les tendances
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
