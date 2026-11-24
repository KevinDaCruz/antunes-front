import { Link } from "react-router-dom";
import SeoHead from "../components/SeoHead";

function PaymentCancelled() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <SeoHead
        title="Paiement annulé"
        description="Ton paiement a été annulé."
        noIndex
      />

      <h1 className="mb-4 text-4xl md:text-5xl">Paiement annulé</h1>
      <p className="mb-8 text-lg font-semibold text-ink-soft">
        Aucun montant n&apos;a été prélevé. Tu peux réessayer quand tu veux.
      </p>

      <Link to="/catalog" className="btn-pink">
        Retour au catalogue
      </Link>
    </div>
  );
}

export default PaymentCancelled;
