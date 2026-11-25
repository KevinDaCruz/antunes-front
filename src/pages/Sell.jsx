import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { HEADER_CATEGORIES } from "../constants/navigation";
import { apiRequest, ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";
import EmailVerificationNotice from "../components/EmailVerificationNotice";
import ProductVisual from "../components/ProductVisual";
import ConditionBadge from "../components/ConditionBadge";
import PageLoader from "../components/PageLoader";
import { formatPrice } from "../utils/formatPrice";
import { computeBuyerTotal } from "../utils/serviceFee";

const CONDITIONS = ["Neuf", "Reconditionné", "Bon état", "Occasion"];

const INITIAL_FORM_STATE = {
  name: "",
  brand: "",
  category: "",
  condition: "",
  price: "",
  description: "",
};

// Le même formulaire sert à déposer une annonce (/sell) et à modifier une
// annonce existante (/sell/:id), prérempli avec ses valeurs actuelles.
function Sell() {
  const { id: editedProductId } = useParams();
  const isEditing = Boolean(editedProductId);
  const { addProduct, updateProduct } = useProducts();
  const { user } = useAuth();
  const canPublish = isEditing || Boolean(user?.emailVerified);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) {
      return undefined;
    }

    let isCancelled = false;

    async function loadEditedProduct() {
      try {
        const { product } = await apiRequest(`/products/${editedProductId}`);

        if (isCancelled) {
          return;
        }

        if (product.seller?._id !== user?.id) {
          setLoadError("Tu ne peux modifier que tes propres annonces.");
        } else if (
          product.status === "sold" ||
          product.status === "withdrawn"
        ) {
          setLoadError(
            "Cette annonce n'est plus en vente : elle ne peut plus être modifiée.",
          );
        } else {
          setFormValues({
            name: product.name,
            brand: product.brand,
            category: product.category,
            condition: product.condition,
            price: String(product.price),
            description: product.description ?? "",
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setLoadError(
            error instanceof ApiError
              ? error.message
              : "Impossible de charger l'annonce pour le moment.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingProduct(false);
        }
      }
    }

    loadEditedProduct();

    return () => {
      isCancelled = true;
    };
  }, [editedProductId, isEditing, user?.id]);

  function handleFieldChange(field, value) {
    setFormValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const { name, brand, category, condition, price, description } = formValues;

    if (!name || !brand || !category || !condition || !price) {
      setErrorMessage("Merci de remplir tous les champs obligatoires.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const productData = {
      name,
      brand,
      category,
      condition,
      price: Number(price),
      description,
      imageUrl: `https://placehold.co/600x600.png?text=${encodeURIComponent(name)}`,
    };

    try {
      const savedProduct = isEditing
        ? await updateProduct(editedProductId, productData)
        : await addProduct(productData);

      setFormValues(INITIAL_FORM_STATE);
      navigate(`/product/${savedProduct._id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : isEditing
            ? "Impossible d'enregistrer les modifications pour le moment."
            : "Impossible de publier l'annonce pour le moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const price = Number(formValues.price);
  const previewProduct = {
    name: formValues.name || "Nom de ton appareil",
    brand: formValues.brand || "Marque",
    category: formValues.category || "Accessoires",
    condition: formValues.condition || "Bon état",
    price: price > 0 ? price : 0,
  };

  if (isLoadingProduct) {
    return <PageLoader />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <SeoHead
          title="Modifier une annonce"
          description="Modification d'une annonce Antunes."
          noIndex
        />
        <h1 className="text-4xl">Modifier une annonce</h1>
        <div className="alert-error mt-6" role="alert">
          {loadError}
        </div>
        <Link to="/account" className="btn-white mt-6">
          Retour à mon compte
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      {isEditing ? (
        <SeoHead
          title="Modifier une annonce"
          description="Modification d'une annonce Antunes."
          noIndex
        />
      ) : (
        <SeoHead
          title="Vendre un article"
          description="Publie gratuitement une annonce sur Antunes et vends ta tech d'occasion (smartphones, PC, consoles, composants) en quelques minutes."
        />
      )}

      <p className="eyebrow">
        {isEditing ? "Ton annonce" : "Gratuit · 2 minutes"}
      </p>
      <h1 className="mt-4 text-5xl md:text-6xl">
        {isEditing ? "Modifier l'annonce" : "Déposer une annonce"}
      </h1>

      {isEditing ? null : (
        <div className="mt-8">
          <EmailVerificationNotice reason="Cette étape est nécessaire pour publier une annonce." />
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form className="card space-y-6 p-8" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="alert-error" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <div>
            <label htmlFor="productName" className="label">
              Nom du produit
            </label>
            <input
              type="text"
              className="field"
              id="productName"
              placeholder="Ex : iPhone 15 Pro 256 Go"
              value={formValues.name}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
            />
            <p className="mt-1.5 text-xs font-semibold text-ink-muted">
              Indique le modèle exact : c&apos;est ce que recherchent les
              acheteurs.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="productBrand" className="label">
                Marque
              </label>
              <input
                type="text"
                className="field"
                id="productBrand"
                placeholder="Ex : Apple"
                value={formValues.brand}
                onChange={(event) =>
                  handleFieldChange("brand", event.target.value)
                }
              />
            </div>
            <div>
              <label htmlFor="productPrice" className="label">
                Prix
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="field !pr-10"
                  id="productPrice"
                  placeholder="150"
                  min="1"
                  max="20000"
                  step="0.01"
                  value={formValues.price}
                  onChange={(event) =>
                    handleFieldChange("price", event.target.value)
                  }
                />
                <span
                  className="absolute top-1/2 right-4 -translate-y-1/2 font-black text-ink"
                  aria-hidden="true"
                >
                  €
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="productCategory" className="label">
                Catégorie
              </label>
              <select
                className="field"
                id="productCategory"
                value={formValues.category}
                onChange={(event) =>
                  handleFieldChange("category", event.target.value)
                }
              >
                <option value="" disabled>
                  Choisir une catégorie
                </option>
                {HEADER_CATEGORIES.map((categoryOption) => (
                  <option key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="productCondition" className="label">
                État
              </label>
              <select
                className="field"
                id="productCondition"
                value={formValues.condition}
                onChange={(event) =>
                  handleFieldChange("condition", event.target.value)
                }
              >
                <option value="" disabled>
                  Choisir un état
                </option>
                {CONDITIONS.map((conditionOption) => (
                  <option key={conditionOption} value={conditionOption}>
                    {conditionOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="productDescription" className="label">
              Description
            </label>
            <textarea
              className="field"
              id="productDescription"
              rows="4"
              placeholder="État de la batterie, accessoires fournis, défauts éventuels…"
              value={formValues.description}
              onChange={(event) =>
                handleFieldChange("description", event.target.value)
              }
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t-3 border-ink pt-6">
            <p className="max-w-sm text-sm font-semibold text-ink-muted">
              {price > 0
                ? `L'acheteur paiera ${formatPrice(computeBuyerTotal(price))} : ton prix + les frais de protection. Tu reçois ${formatPrice(price)}.`
                : "Publier une annonce est gratuit : les frais de protection sont payés par l'acheteur."}
            </p>
            <button
              type="submit"
              className="btn-pink !px-8 !py-4 text-base"
              disabled={isSubmitting || !canPublish}
            >
              {isEditing
                ? isSubmitting
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"
                : isSubmitting
                  ? "Publication..."
                  : "Publier l'annonce"}
            </button>
          </div>
        </form>

        <aside className="h-fit lg:sticky lg:top-44" aria-label="Aperçu">
          <p className="label">Aperçu en direct</p>
          <div className="overflow-hidden rounded-(--radius-card) bg-white text-ink brutal">
            <ProductVisual
              product={previewProduct}
              className="aspect-[4/3.4] border-b-3 border-ink"
            >
              <div className="absolute bottom-3 left-3">
                <ConditionBadge condition={previewProduct.condition} />
              </div>
            </ProductVisual>
            <div className="p-4">
              <p className="text-xs font-bold text-ink-muted">
                {previewProduct.brand} · {previewProduct.category}
              </p>
              <p className="text-base font-extrabold">{previewProduct.name}</p>
              <p className="mt-3 text-2xl font-black tracking-tight">
                {formatPrice(previewProduct.price)}
              </p>
            </div>
          </div>
          <p className="alert-info mt-4">
            Les photos réelles arrivent bientôt : en attendant, une illustration
            de la catégorie est affichée.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Sell;
