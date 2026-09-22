import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { HEADER_CATEGORIES } from "../constants/navigation";
import { ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";

const CONDITIONS = ["Neuf", "Reconditionné", "Bon état", "Occasion"];

const INITIAL_FORM_STATE = {
  name: "",
  brand: "",
  category: "",
  condition: "",
  price: "",
  description: "",
};

function Sell() {
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleFieldChange(field, value) {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { name, brand, category, condition, price, description } =
      formValues;

    if (!name || !brand || !category || !condition || !price) {
      setErrorMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const newProduct = await addProduct({
        name,
        brand,
        category,
        condition,
        price: Number(price),
        description,
        imageUrl: `https://placehold.co/600x600.png?text=${encodeURIComponent(name)}`,
      });

      setFormValues(INITIAL_FORM_STATE);
      navigate(`/product/${newProduct._id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : "Impossible de publier l'annonce pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container sell-page my-4">
      <SeoHead
        title="Vendre un article"
        description="Publie gratuitement une annonce sur Antunes et vends ta tech d'occasion (smartphones, PC, consoles, composants) en quelques minutes."
      />

      <section className="sell-hero mb-4">
        <div>
          <p className="sell-kicker mb-2">Publication guidée</p>
          <h1 className="h2 mb-2">Vendre un article</h1>
          <p className="text-muted mb-0">
            Crée une annonce claire, attractive et visible en quelques minutes.
          </p>
        </div>
        <div className="sell-hero-chips">
          <span className="sell-chip">Mise en ligne rapide</span>
          <span className="sell-chip">Conseils intégrés</span>
          <span className="sell-chip">Visibilité optimisée</span>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <form className="sell-form-card" onSubmit={handleSubmit}>
            {errorMessage ? (
              <div className="alert alert-danger" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Télécharger une photo
              </label>
              <input className="form-control" type="file" id="productImage" />
              <div className="form-text">
                Pour l'instant, une image de démonstration est générée
                automatiquement à partir du nom du produit.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Nom du produit
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                placeholder="Ex: iPhone 15 Pro"
                value={formValues.name}
                onChange={(event) =>
                  handleFieldChange("name", event.target.value)
                }
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productBrand" className="form-label">
                  Marque
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productBrand"
                  placeholder="Ex: Apple"
                  value={formValues.brand}
                  onChange={(event) =>
                    handleFieldChange("brand", event.target.value)
                  }
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="productCondition" className="form-label">
                  État
                </label>
                <select
                  id="productCondition"
                  className="form-select"
                  value={formValues.condition}
                  onChange={(event) =>
                    handleFieldChange("condition", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Choisir...
                  </option>
                  {CONDITIONS.map((conditionOption) => (
                    <option key={conditionOption} value={conditionOption}>
                      {conditionOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productCategory" className="form-label">
                  Catégorie
                </label>
                <select
                  id="productCategory"
                  className="form-select"
                  value={formValues.category}
                  onChange={(event) =>
                    handleFieldChange("category", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Choisir...
                  </option>
                  {HEADER_CATEGORIES.map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="productPrice" className="form-label">
                  Prix
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="productPrice"
                    placeholder="150"
                    min="0"
                    value={formValues.price}
                    onChange={(event) =>
                      handleFieldChange("price", event.target.value)
                    }
                  />
                  <span className="input-group-text">€</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="productDescription"
                rows="4"
                placeholder="Décrivez votre produit..."
                value={formValues.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
              ></textarea>
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-primary btn-lg fx-neon"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Publication..." : "Publier l'annonce"}
              </button>
            </div>
          </form>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="sell-tips-card h-100">
            <h2 className="h5 mb-3">Conseils pour vendre plus vite</h2>
            <ul className="sell-tips-list mb-0">
              <li>Ajoute 3 photos nettes minimum.</li>
              <li>Donne un titre précis avec modèle complet.</li>
              <li>Indique l’état réel du produit sans ambiguïté.</li>
              <li>Propose un prix cohérent avec le marché.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Sell;
