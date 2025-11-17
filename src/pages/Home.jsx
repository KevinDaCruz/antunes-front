import { products } from "../data/mockProducts";
import ProductCard from "../components/ProductCard";

function Home() {
  return (
    <>
      <div className="p-5 mb-4 bg-light">
        <div className="container text-center">
          <h1 className="display-5 fw-bold">Bienvenue sur Antunes</h1>
          <p className="fs-4">
            La plateforme n°1 pour acheter et vendre vos produits électroniques
            d'occasion ou reconditionnés.
          </p>
          <a href="/sell" className="btn btn-primary btn-lg mt-3">
            Commencer à vendre
          </a>
        </div>
      </div>

      <div className="container">
        <h2 className="mb-4">Derniers produits ajoutés</h2>

        <div className="row">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-4 mb-4">
          <button className="btn btn-outline-primary btn-lg">Voir plus</button>
        </div>
      </div>
    </>
  );
}

export default Home;
