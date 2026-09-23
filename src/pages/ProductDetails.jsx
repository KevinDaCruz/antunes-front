import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";

const DEFAULT_MESSAGE = "Bonjour, cet article est-il toujours disponible ?";

function ProductDetails() {
  const { id } = useParams();
  const { products } = useProducts();
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [contactError, setContactError] = useState("");
  const [buyError, setBuyError] = useState("");
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  const product = products.find((p) => p._id === id);

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

  async function handleBuyNow() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setBuyError("");
    setIsRedirectingToPayment(true);

    try {
      const data = await apiRequest("/payments/checkout-session", {
        method: "POST",
        body: { productId: product._id },
        token,
      });
      window.location.assign(data.url);
    } catch (error) {
      setBuyError(
        error instanceof ApiError
          ? error.message
          : "Impossible de démarrer le paiement pour le moment.",
      );
      setIsRedirectingToPayment(false);
    }
  }

  async function handleContactSeller() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setContactError("");

    try {
      const data = await apiRequest("/conversations", {
        method: "POST",
        body: { productId: product._id, content: DEFAULT_MESSAGE },
        token,
      });
      navigate(`/messages?conversationId=${data.conversation._id}`);
    } catch (error) {
      setContactError(
        error instanceof ApiError
          ? error.message
          : "Impossible de contacter le vendeur pour le moment.",
      );
    }
  }

  const memberSinceYear = product.seller?.createdAt
    ? new Date(product.seller.createdAt).getFullYear()
    : null;

  return (
    <div className="container product-details-page my-4">
      <SeoHead
        title={product.name}
        description={`${product.name} - ${product.brand}, ${product.condition.toLowerCase()}, à ${product.price}€ sur Antunes.`}
      />

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
              {product.price}€
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
                  {product.description ??
                    `Il s'agit d'un ${product.name} de marque ${product.brand} en ${product.condition.toLowerCase()}.`}
                </p>
              </li>
            </ul>

            {buyError ? (
              <div className="alert alert-danger" role="alert">
                {buyError}
              </div>
            ) : null}
            {contactError ? (
              <div className="alert alert-danger" role="alert">
                {contactError}
              </div>
            ) : null}

            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-primary btn-lg fx-neon"
                onClick={handleBuyNow}
                disabled={isRedirectingToPayment}
              >
                {isRedirectingToPayment
                  ? "Redirection vers le paiement..."
                  : "Acheter maintenant"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={handleContactSeller}
              >
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
                <h5 className="card-title mb-0">
                  {product.seller?.pseudo ?? "Vendeur_Pseudo"}
                </h5>
                <p className="card-text text-muted mb-0">
                  Membre depuis {memberSinceYear ?? "peu de temps"}
                </p>
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
