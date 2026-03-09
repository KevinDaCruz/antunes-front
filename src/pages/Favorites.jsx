import ProductCard from "../components/ProductCard";
import { products } from "../data/mockProducts";

function Favorites() {
  const favoriteProducts = products.slice(0, 2);

  return (
    <div className="container favorites-page my-4">
      <section className="favorites-hero mb-4">
        <div>
          <p className="favorites-kicker mb-2">Espace personnel</p>
          <h1 className="h2 mb-2">Mes favoris</h1>
          <p className="text-muted mb-0">
            Retrouve ici les annonces que tu surveilles pour ne rater aucune
            bonne affaire.
          </p>
        </div>
        <div className="favorites-hero-chips">
          <span className="favorites-chip">
            {favoriteProducts.length} suivi(s)
          </span>
          <span className="favorites-chip">Alertes prix</span>
          <span className="favorites-chip">Accès rapide</span>
        </div>
      </section>

      {favoriteProducts.length === 0 ? (
        <section className="favorites-empty-state" role="alert">
          <h2 className="h5 mb-2">Aucun favori pour le moment</h2>
          <p className="text-muted mb-0">
            Ajoute des produits à ta liste pour les retrouver ici facilement.
          </p>
        </section>
      ) : (
        <div className="row favorites-grid">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
