import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRequest, ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";

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
    <div className="container my-5 text-center">
      <SeoHead
        title="Paiement confirmé"
        description="Confirmation de ton achat sur Antunes."
        noIndex
      />

      <h1 className="h2 mb-3">Paiement confirmé 🎉</h1>

      {isLoading ? (
        <p className="text-muted">Vérification de ta commande...</p>
      ) : errorMessage ? (
        <div className="alert alert-danger d-inline-block" role="alert">
          {errorMessage}
        </div>
      ) : order ? (
        <p className="text-muted mb-4">
          Ton achat de <strong>{order.product?.name}</strong> pour{" "}
          <strong>{order.amountTotal}€</strong> a bien été enregistré.
        </p>
      ) : (
        <p className="text-muted mb-4">Merci pour ton achat.</p>
      )}

      <div className="d-flex justify-content-center gap-2 mt-3">
        <Link to="/catalog" className="btn btn-primary fx-neon">
          Continuer mes achats
        </Link>
        <Link to="/account" className="btn btn-outline-secondary">
          Voir mon compte
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;
