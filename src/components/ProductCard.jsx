import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { Heart } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import ConditionBadge from "./ConditionBadge";
import ProductVisual from "./ProductVisual";

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
    <article className="group relative flex flex-col overflow-hidden rounded-(--radius-card) bg-white brutal press">
      <ProductVisual
        product={product}
        className="aspect-[4/3.4] border-b-3 border-ink"
        illustrationClassName="transition duration-300 group-hover:-rotate-3 group-hover:scale-105"
      >
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          <ConditionBadge condition={product.condition} />
          {/* Un article vendu peut rester visible dans les favoris. */}
          {product.status === "sold" ? (
            <span className="rounded-full border-2 border-ink bg-ink px-2.5 py-0.5 text-xs font-extrabold text-cream">
              Vendu
            </span>
          ) : null}
        </div>
      </ProductVisual>

      <button
        type="button"
        className={`absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full border-2 border-ink text-ink transition hover:bg-pink ${
          productIsFavorite ? "bg-pink" : "bg-white"
        } ${isBursting ? "scale-125" : ""}`}
        aria-label={
          productIsFavorite
            ? "Retirer des favoris"
            : "Ajouter l'article aux favoris"
        }
        aria-pressed={productIsFavorite}
        onClick={handleFavoriteClick}
      >
        <Heart
          className="size-4.5"
          fill={productIsFavorite ? "currentColor" : "none"}
          aria-hidden="true"
        />
      </button>

      <div className="flex flex-1 flex-col gap-0.5 p-4">
        <p className="text-xs font-bold text-ink-muted">
          {product.brand} · {product.category}
        </p>
        <h3 className="font-sans text-base leading-snug font-extrabold">
          {/* Le lien couvre toute la carte (pseudo-élément), le bouton
              favori reste cliquable au-dessus. */}
          <Link
            to={`/product/${product._id}`}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex flex-col gap-0.5 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-2">
          <p className="text-2xl font-black tracking-tight">
            {formatPrice(product.price)}
          </p>
          {product.serviceFee !== undefined ? (
            <p className="text-[11px] leading-tight font-semibold text-ink-muted sm:text-right">
              {formatPrice(product.price + product.serviceFee)}
              <br className="hidden sm:block" /> protection incluse
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
