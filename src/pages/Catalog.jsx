import ProductCard from "../components/ProductCard";
import { products } from "../data/mockProducts";

function Catalog() {
  const categories = ["Consoles", "PC", "Smartphones", "Audio", "Gaming"];

  return (
    <div className="container catalog-page my-4">
      <section className="catalog-hero mb-4">
        <div>
          <p className="catalog-kicker mb-2">Marketplace Tech</p>
          <h1 className="h2 mb-2">Explore les meilleures offres du moment</h1>
          <p className="text-muted mb-0">
            Filtre rapidement les annonces et trouve le produit parfait au bon
            prix.
          </p>
        </div>
        <div className="catalog-hero-meta">
          <span className="catalog-pill">
            {products.length} annonce{products.length > 1 ? "s" : ""}
          </span>
          <span className="catalog-pill">Vendeurs vérifiés</span>
          <span className="catalog-pill">Mise à jour en temps réel</span>
        </div>
        <div className="catalog-tags mt-3">
          {categories.map((category) => (
            <span key={category} className="catalog-tag">
              {category}
            </span>
          ))}
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h2 className="h5 mb-0">Résultats disponibles</h2>
        <span className="badge catalog-result-badge">Tri: Plus récents</span>
      </div>

      <div className="row g-4">
        <aside className="col-12 col-lg-3">
          <div className="card shadow-sm border-0 catalog-filters-card catalog-filters-premium">
            <div className="card-body">
              <h2 className="h6 text-uppercase text-muted mb-3">
                Filtres intelligents
              </h2>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Catégorie
                </label>
                <select id="category" className="form-select">
                  <option>Toutes</option>
                  <option>Consoles</option>
                  <option>Jeux vidéo</option>
                  <option>Ordinateurs</option>
                  <option>Composants</option>
                  <option>Périphériques</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="condition" className="form-label">
                  État
                </label>
                <select id="condition" className="form-select">
                  <option>Tous</option>
                  <option>Neuf</option>
                  <option>Reconditionné</option>
                  <option>Bon état</option>
                  <option>Occasion</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sort" className="form-label">
                  Trier par
                </label>
                <select id="sort" className="form-select">
                  <option>Plus récents</option>
                  <option>Prix croissant</option>
                  <option>Prix décroissant</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                <button className="btn btn-primary fx-neon" type="button">
                  Appliquer les filtres
                </button>
                <button className="btn btn-outline-secondary" type="button">
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="col-12 col-lg-9 catalog-products-wrap">
          <div className="row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Catalog;
