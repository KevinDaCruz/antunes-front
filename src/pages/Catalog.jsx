import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SeoHead from "../components/SeoHead";
import { useProducts } from "../hooks/useProducts";
import { HEADER_CATEGORIES } from "../constants/navigation";

const CONDITIONS = ["Neuf", "Reconditionné", "Bon état", "Occasion"];

const SORT_LABELS = {
  recent: "Plus récents",
  priceAsc: "Prix croissant",
  priceDesc: "Prix décroissant",
};

function Catalog() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const sortBy = searchParams.get("sort") ?? "recent";
  const searchQuery = searchParams.get("search") ?? "";

  function updateFilter(key, value) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  }

  function handleResetFilters() {
    setSearchParams({});
  }

  const filteredProducts = useMemo(() => {
    let result = products;

    if (category) {
      result = result.filter((product) => product.category === category);
    }

    if (condition) {
      result = result.filter((product) => product.condition === condition);
    }

    if (searchQuery) {
      const normalizedQuery = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.brand.toLowerCase().includes(normalizedQuery),
      );
    }

    if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, category, condition, searchQuery, sortBy]);

  return (
    <div className="container catalog-page my-4">
      <SeoHead
        title="Catalogue"
        description="Parcours toutes les annonces tech : smartphones, PC, consoles, composants et accessoires d'occasion ou reconditionnés, filtrables par catégorie, état et prix."
      />

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
            {filteredProducts.length} annonce
            {filteredProducts.length > 1 ? "s" : ""}
          </span>
          <span className="catalog-pill">Vendeurs vérifiés</span>
          <span className="catalog-pill">Mise à jour en temps réel</span>
        </div>
        <div className="catalog-tags mt-3">
          {HEADER_CATEGORIES.map((categoryOption) => (
            <button
              key={categoryOption}
              type="button"
              className={`catalog-tag catalog-tag-btn ${
                category === categoryOption ? "is-active" : ""
              }`}
              onClick={() => updateFilter("category", categoryOption)}
            >
              {categoryOption}
            </button>
          ))}
        </div>
      </section>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h2 className="h5 mb-0">
          {searchQuery
            ? `Résultats pour "${searchQuery}"`
            : "Résultats disponibles"}
        </h2>
        <span className="badge catalog-result-badge">
          Tri: {SORT_LABELS[sortBy]}
        </span>
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
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                >
                  <option value="">Toutes</option>
                  {HEADER_CATEGORIES.map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="condition" className="form-label">
                  État
                </label>
                <select
                  id="condition"
                  className="form-select"
                  value={condition}
                  onChange={(event) =>
                    updateFilter("condition", event.target.value)
                  }
                >
                  <option value="">Tous</option>
                  {CONDITIONS.map((conditionOption) => (
                    <option key={conditionOption} value={conditionOption}>
                      {conditionOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="sort" className="form-label">
                  Trier par
                </label>
                <select
                  id="sort"
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => updateFilter("sort", event.target.value)}
                >
                  <option value="recent">{SORT_LABELS.recent}</option>
                  <option value="priceAsc">{SORT_LABELS.priceAsc}</option>
                  <option value="priceDesc">{SORT_LABELS.priceDesc}</option>
                </select>
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleResetFilters}
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="col-12 col-lg-9 catalog-products-wrap">
          {filteredProducts.length === 0 ? (
            <div className="catalog-empty-state" role="alert">
              <h3 className="h5 mb-2">Aucune annonce ne correspond</h3>
              <p className="text-muted mb-0">
                Essaie d'élargir tes filtres ou de modifier ta recherche.
              </p>
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Catalog;
