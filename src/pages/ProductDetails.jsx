import { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";
import { formatPrice } from "../utils/formatPrice";
import { buildProductStructuredData } from "../utils/structuredData";
import SeoHead from "../components/SeoHead";
import PageLoader from "../components/PageLoader";
import ProductVisual from "../components/ProductVisual";
import ConditionBadge from "../components/ConditionBadge";
import { BadgeEuro, LockKeyhole, MessageCircle } from "lucide-react";

const DEFAULT_MESSAGE = "Bonjour, cet article est-il toujours disponible ?";

function ProductDetails() {
  const { id } = useParams();
  const { isAuthenticated, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [contactError, setContactError] = useState("");
  const [buyError, setBuyError] = useState("");
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  // On garde l'id associé au résultat : tant qu'il ne correspond pas à
  // l'id de l'URL, c'est que le chargement de cette annonce est en cours.
  const [loaded, setLoaded] = useState({ id: null, product: null, error: "" });

  useEffect(() => {
    let isCancelled = false;

    apiRequest(`/products/${id}`)
      .then((data) => {
        if (!isCancelled) {
          setLoaded({ id, product: data.product, error: "" });
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          const isNotFound = error instanceof ApiError && error.status === 404;
          setLoaded({
            id,
            product: null,
            error: isNotFound
              ? "notFound"
              : "Impossible de charger cette annonce pour le moment.",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  if (loaded.id !== id) {
    return <PageLoader />;
  }

  const { product } = loaded;

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <img
          src="/illustrations/manettes.svg"
          alt=""
          width="128"
          height="128"
          className="mx-auto size-32 rotate-6"
        />
        <h1 className="mt-6 text-4xl">
          {loaded.error === "notFound" ? "Produit non trouvé" : loaded.error}
        </h1>
        <Link to="/catalog" className="btn-pink mt-8">
          Voir le catalogue
        </Link>
      </div>
    );
  }

  const isSold = product.status === "sold";
  const isOwnProduct = Boolean(user) && product.seller?._id === user.id;

  async function handleBuyNow() {
    if (!isAuthenticated) {
      // Après la connexion, la page Login ramène le visiteur sur l'annonce.
      navigate("/login", { state: { from: location } });
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
      // Après la connexion, la page Login ramène le visiteur sur l'annonce.
      navigate("/login", { state: { from: location } });
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

  const total =
    product.serviceFee !== undefined
      ? product.price + product.serviceFee
      : product.price;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <SeoHead
        title={product.name}
        description={`${product.name} - ${product.brand}, ${product.condition.toLowerCase()}, à ${product.price}€ sur Antunes.`}
        structuredData={buildProductStructuredData(
          product,
          window.location.href,
        )}
      />

      <nav
        className="text-sm font-bold text-ink-muted"
        aria-label="Fil d'Ariane"
      >
        <Link to="/" className="hover:underline">
          Accueil
        </Link>{" "}
        /{" "}
        <Link
          to={`/catalog?category=${encodeURIComponent(product.category)}`}
          className="hover:underline"
        >
          {product.category}
        </Link>{" "}
        / <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <ProductVisual
            product={product}
            className="aspect-square overflow-hidden rounded-3xl brutal"
            illustrationClassName="!size-[62%] -rotate-6"
          >
            <p className="absolute bottom-5 left-5 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold text-ink">
              Illustration · photos du vendeur bientôt disponibles
            </p>
          </ProductVisual>

          <section
            className="card mt-8 p-7"
            aria-labelledby="description-title"
          >
            <h2 id="description-title" className="text-2xl">
              Description
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed font-medium text-ink-soft">
              {product.description ??
                `Il s'agit d'un ${product.name} de marque ${product.brand} en ${product.condition.toLowerCase()}.`}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-[15px]">
              {[
                ["Marque", product.brand],
                ["État", product.condition],
                ["Catégorie", product.category],
                ["Livraison", "Possible"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl border-2 border-ink bg-cream p-3 text-ink"
                >
                  <dt className="text-xs font-bold text-ink-muted uppercase">
                    {label}
                  </dt>
                  <dd className="font-extrabold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div>
          <div className="card p-7 lg:sticky lg:top-44">
            <div className="flex flex-wrap gap-2">
              <ConditionBadge condition={product.condition} />
              {isSold ? (
                <span className="rounded-full border-2 border-ink bg-ink px-2.5 py-0.5 text-xs font-extrabold text-cream">
                  Vendu
                </span>
              ) : null}
            </div>
            <p className="mt-5 text-sm font-bold text-ink-muted">
              {product.brand} · {product.category}
            </p>
            <h1 className="mt-1 text-4xl leading-tight">{product.name}</h1>
            <p className="mt-5 text-6xl font-black tracking-tighter">
              {formatPrice(product.price)}
            </p>

            {product.serviceFee !== undefined ? (
              <dl className="mt-5 space-y-2 rounded-xl border-2 border-ink bg-cream p-4 text-[15px] font-semibold text-ink">
                <div className="flex justify-between">
                  <dt>Prix de l&apos;article</dt>
                  <dd>{formatPrice(product.price)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Frais de service (protection acheteur)</dt>
                  <dd>{formatPrice(product.serviceFee)}</dd>
                </div>
                <div className="flex justify-between border-t-2 border-dashed border-ink pt-2 text-lg font-black">
                  <dt>Total à payer</dt>
                  <dd>{formatPrice(total)}</dd>
                </div>
              </dl>
            ) : null}

            <div className="mt-5 space-y-3">
              {buyError ? (
                <div className="alert-error" role="alert">
                  {buyError}
                </div>
              ) : null}
              {contactError ? (
                <div className="alert-error" role="alert">
                  {contactError}
                </div>
              ) : null}
              {isSold ? (
                <div className="alert-info" role="status">
                  Cet article a déjà trouvé preneur.
                </div>
              ) : null}
            </div>

            {isOwnProduct ? (
              <p className="alert-info mt-5">C&apos;est ton annonce.</p>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="btn-pink !py-4 text-base"
                  onClick={handleBuyNow}
                  disabled={isRedirectingToPayment || isSold}
                >
                  {isRedirectingToPayment
                    ? "Redirection vers le paiement..."
                    : "Acheter maintenant"}
                </button>
                <button
                  type="button"
                  className="btn-white !py-4 text-base"
                  onClick={handleContactSeller}
                  disabled={isSold}
                >
                  <MessageCircle className="size-5" aria-hidden="true" />
                  Contacter le vendeur
                </button>
              </div>
            )}

            <ul className="mt-6 space-y-3 text-[15px] font-semibold">
              <li className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-mint text-ink">
                  <LockKeyhole className="size-4" aria-hidden="true" />
                </span>
                Paiement sécurisé par Stripe, ta carte n&apos;est jamais
                transmise au vendeur.
              </li>
              <li className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-sky text-ink">
                  <BadgeEuro className="size-4" aria-hidden="true" />
                </span>
                Le total affiché est exactement le montant débité.
              </li>
            </ul>
          </div>

          <div className="card mt-6 flex items-center gap-4 p-5">
            <span className="grid size-14 shrink-0 place-items-center rounded-full border-3 border-ink bg-lilac text-xl font-black text-ink">
              {(product.seller?.pseudo ?? "?").slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black">
                {product.seller?.pseudo ?? "Vendeur"}
              </p>
              <p className="text-sm font-semibold text-ink-muted">
                Membre depuis {memberSinceYear ?? "peu de temps"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
