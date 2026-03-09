import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
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

    setIsFavorite((currentValue) => {
      const nextValue = !currentValue;

      if (nextValue) {
        setIsBursting(true);

        if (burstTimeoutRef.current) {
          window.clearTimeout(burstTimeoutRef.current);
        }

        burstTimeoutRef.current = window.setTimeout(() => {
          setIsBursting(false);
          burstTimeoutRef.current = null;
        }, 520);
      }

      return nextValue;
    });
  }

  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0 product-card">
        <button
          type="button"
          className={`favorite-toggle-btn ${isFavorite ? "is-favorite" : ""} ${
            isBursting ? "is-bursting" : ""
          }`}
          aria-label={
            isFavorite ? "Retirer des favoris" : "Ajouter l'article aux favoris"
          }
          aria-pressed={isFavorite}
          onClick={handleFavoriteClick}
        >
          <span aria-hidden="true">♥</span>
        </button>

        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none text-dark product-card-link"
        >
          <img
            src={product.imageUrl}
            className="card-img-top product-card-image"
            alt={product.name}
          />
          <div className="card-body product-card-body">
            <h5 className="card-title fw-bold">{product.price}</h5>
            <p className="card-text text-muted mb-1">{product.brand}</p>
            <p className="card-text text-secondary">{product.condition}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
