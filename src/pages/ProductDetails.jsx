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
    <div className="container my-4">
      <div className="row g-5">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6">
          <h1 className="display-6">{product.name}</h1>

          <h2 className="text-primary fw-bold display-4 my-3">
            {product.price}
          </h2>

          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item d-flex justify-content-between px-0">
              <strong>Marque:</strong>
              <span>{product.brand}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between px-0">
              <strong>État:</strong>
              <span>{product.condition}</span>
            </li>
            <li className="list-group-item px-0">
              <strong>Description:</strong>
              <p className="text-muted mt-2">
                (Ici viendra la description complète du produit. Pour l'instant,
                nous savons qu'il s'agit d'un {product.name} de marque{" "}
                {product.brand}
                en {product.condition.toLowerCase()}.)
              </p>
            </li>
          </ul>

          <div className="d-grid">
            <button className="btn btn-primary btn-lg">Acheter</button>
          </div>

          <div className="card mt-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
