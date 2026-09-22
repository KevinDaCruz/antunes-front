import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";

function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useProducts();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const productIsFavorite = isFavorite(product._id);
  const [isBursting, setIsBursting] = useState(false);
  const burstTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current);
      }
    };
  }, []);

  function handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    toggleFavorite(product._id);

    if (!productIsFavorite) {
      setIsBursting(true);

      if (burstTimeoutRef.current) {
        window.clearTimeout(burstTimeoutRef.current);
      }

      burstTimeoutRef.current = window.setTimeout(() => {
        setIsBursting(false);
        burstTimeoutRef.current = null;
      }, 520);
    }
  }

  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <button
          type="button"
          className={`favorite-toggle-btn ${
            productIsFavorite ? "is-favorite" : ""
          } ${isBursting ? "is-bursting" : ""}`}
          aria-label={
            productIsFavorite
              ? "Retirer des favoris"
              : "Ajouter l'article aux favoris"
          }
          aria-pressed={productIsFavorite}
          onClick={handleFavoriteClick}
        >
          <span aria-hidden="true">♥</span>
        </button>

        <Link
          to={`/product/${product._id}`}
          className="text-decoration-none text-dark product-card-link"
        >
          <img
            src={product.imageUrl}
            className="card-img-top product-card-image"
            alt={product.name}
          />
          <div className="card-body product-card-body">
            <h5 className="card-title fw-bold">{product.price}€</h5>
            <p className="card-text text-muted mb-1">{product.brand}</p>
            <p className="card-text text-secondary">{product.condition}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
