import { useParams, Link } from "react-router-dom";
import { products } from "../data/mockProducts";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h2 className="mb-4">Produit non trouvé</h2>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container product-details-page my-4">
      <section className="product-details-hero mb-4">
        <div>
          <p className="product-details-kicker mb-2">Détail annonce</p>
          <h1 className="h2 mb-2">{product.name}</h1>
          <p className="text-muted mb-0">
            Vérifie toutes les informations avant d&apos;acheter, puis contacte
            le vendeur en un clic.
          </p>
        </div>
        <div className="product-details-hero-chips">
          <span className="product-details-chip">{product.condition}</span>
          <span className="product-details-chip">{product.brand}</span>
          <span className="product-details-chip">Livraison possible</span>
        </div>
      </section>

      <div className="row g-4 align-items-start">
        <div className="col-md-6">
          <div className="product-details-media-card">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid rounded w-100 product-details-image"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="product-details-content-card">
            <h2 className="text-primary fw-bold display-4 my-2">
              {product.price}
            </h2>

            <ul className="list-group list-group-flush mb-4 product-details-list">
              <li className="list-group-item d-flex justify-content-between px-0">
                <strong>Marque</strong>
                <span>{product.brand}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between px-0">
                <strong>État</strong>
                <span>{product.condition}</span>
              </li>
              <li className="list-group-item px-0">
                <strong>Description</strong>
                <p className="text-muted mt-2 mb-0">
                  (Ici viendra la description complète du produit. Pour
                  l&apos;instant, nous savons qu&apos;il s&apos;agit d&apos;un{" "}
                  {product.name} de marque {product.brand} en{" "}
                  {product.condition.toLowerCase()}.)
                </p>
              </li>
            </ul>

            <div className="d-flex gap-2 flex-wrap">
              <button className="btn btn-primary btn-lg fx-neon">
                Acheter maintenant
              </button>
              <button className="btn btn-outline-secondary btn-lg">
                Contacter le vendeur
              </button>
            </div>
          </div>

          <div className="card mt-4 product-seller-card">
            <div className="card-body d-flex align-items-center">
              <img
                src="https://placehold.co/50x50.png?text=Avatar"
                alt="vendeur"
                className="rounded-circle me-3"
              />
              <div>
                <h5 className="card-title mb-0">Vendeur_Pseudo</h5>
                <p className="card-text text-muted mb-0">Membre depuis 2024</p>
              </div>
              <div>
                <span className="badge text-bg-success ms-md-4">Réactif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
