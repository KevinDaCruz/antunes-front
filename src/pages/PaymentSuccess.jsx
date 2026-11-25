import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";
import { Check } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

function PaymentSuccess() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!sessionId || !token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiRequest(`/payments/orders/${sessionId}`, {
          token,
        });
        setOrder(data.order);
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : "Impossible de récupérer les détails de la commande.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [sessionId, token]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <SeoHead
        title="Paiement confirmé"
        description="Confirmation de ton achat sur Antunes."
        noIndex
      />

      <span className="mx-auto grid size-24 place-items-center rounded-full border-3 border-ink bg-mint text-ink shadow-brutal">
        <Check className="size-12" aria-hidden="true" />
      </span>
      <h1 className="mt-8 mb-4 text-5xl md:text-6xl">
        Paiement confirmé&nbsp;!
      </h1>

      {isLoading ? (
        <p className="font-semibold text-ink-soft">
          Vérification de ta commande...
        </p>
      ) : errorMessage ? (
        <div className="alert-error mb-6 inline-block" role="alert">
          {errorMessage}
        </div>
      ) : order ? (
        <p className="mb-8 text-lg font-semibold text-ink-soft">
          Ton achat de <strong>{order.product?.name}</strong> pour{" "}
          <strong>{formatPrice(order.amountTotal)}</strong>, frais de protection
          compris, a bien été enregistré. L&apos;annonce passe en « Vendu » et
          la vente apparaît dans l&apos;espace du vendeur.
        </p>
      ) : (
        <p className="mb-8 text-lg font-semibold text-ink-soft">
          Merci pour ton achat.
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/catalog" className="btn-pink">
          Continuer mes achats
        </Link>
        <Link to="/account" className="btn-white">
          Voir mon compte
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
