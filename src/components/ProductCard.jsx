import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="col-12 col-md-6 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <Link
          to={`/product/${product.id}`}
          className="text-decoration-none text-dark"
        >
          <img
            src={product.imageUrl}
            className="card-img-top"
            alt={product.name}
            style={{ height: "250px", objectFit: "cover" }}
          />
          <div className="card-body">
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
