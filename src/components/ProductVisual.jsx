import {
  getCategoryIllustration,
  getCategoryStyle,
} from "../constants/categories";

// Les images de démonstration (placehold.co) sont remplacées par
// l'illustration de la catégorie, en attendant les photos des vendeurs.
function hasRealPhoto(imageUrl) {
  return Boolean(imageUrl) && !imageUrl.includes("placehold.co");
}

function ProductVisual({
  product,
  className = "",
  illustrationClassName = "",
  children,
}) {
  const { tint } = getCategoryStyle(product.category);

  return (
    <div className={`relative ${tint} ${className}`}>
      {hasRealPhoto(product.imageUrl) ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          width="600"
          height="600"
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <img
          src={getCategoryIllustration(product.category)}
          alt=""
          width="200"
          height="200"
          className={`absolute inset-0 m-auto size-[70%] ${illustrationClassName}`}
        />
      )}
      {children}
    </div>
  );
}

export default ProductVisual;
