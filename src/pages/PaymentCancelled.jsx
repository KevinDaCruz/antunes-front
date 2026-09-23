import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

function PaymentCancelled() {
  return (
    <div className="container my-5 text-center">
      <SeoHead
        title="Paiement annulé"
        description="Ton paiement a été annulé."
        noIndex
      />

      <h1 className="h2 mb-3">Paiement annulé</h1>
      <p className="text-muted mb-4">
        Aucun montant n&apos;a été prélevé. Tu peux réessayer quand tu veux.
      </p>

      <Link to="/catalog" className="btn btn-primary fx-neon">
        Retour au catalogue
      </Link>
    </div>
  );
}

export default PaymentCancelled;
