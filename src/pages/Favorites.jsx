import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import SeoHead from "../components/SeoHead";

function Favorites() {
  const { favoriteProducts } = useProducts();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <SeoHead
        title="Mes favoris"
        description="Retrouve les annonces tech que tu surveilles sur Antunes."
        noIndex
      />

      <h1 className="text-5xl md:text-6xl">Mes favoris</h1>
      <p className="mt-3 font-semibold text-ink-soft">
        {favoriteProducts.length > 0
          ? `${favoriteProducts.length} annonce${favoriteProducts.length > 1 ? "s" : ""} gardée${favoriteProducts.length > 1 ? "s" : ""} de côté. Le total affiché inclut les frais de protection.`
          : "Garde de côté les annonces qui t'intéressent avec le cœur."}
      </p>

      {favoriteProducts.length === 0 ? (
        <section className="card mt-8 p-10 text-center" role="alert">
          <img
            src="/illustrations/audio.svg"
            alt=""
            width="112"
            height="112"
            className="mx-auto size-28 rotate-6"
          />
          <h2 className="mt-4 text-2xl">Aucun favori pour le moment</h2>
          <p className="mt-2 font-semibold text-ink-soft">
            Clique sur le cœur d&apos;une annonce pour la retrouver ici.
          </p>
          <Link to="/catalog" className="btn-pink mt-6">
            Explorer le catalogue
          </Link>
        </section>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 md:gap-7 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
