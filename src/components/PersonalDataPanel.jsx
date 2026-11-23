import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRequest } from "../utils/apiClient";
import { downloadJson } from "../utils/downloadJson";
import PasswordInput from "./PasswordInput";

// Exercice des droits RGPD depuis l'espace compte : accès / portabilité
// (export JSON) et effacement (suppression du compte).
function PersonalDataPanel() {
  const { token, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [exportError, setExportError] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleExportClick() {
    setExportError("");
    setIsExporting(true);

    try {
      const data = await apiRequest("/users/me/export", { token });
      downloadJson(data, "antunes-mes-donnees.json");
    } catch {
      setExportError("Impossible de générer l'export pour le moment.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDeleteSubmit(event) {
    event.preventDefault();

    setDeleteError("");
    setIsDeleting(true);

    const result = await deleteAccount(deletePassword);

    if (result.success) {
      navigate("/", { replace: true });
      return;
    }

    setDeleteError(result.error);
    setIsDeleting(false);
  }

  return (
    <div className="card border-0 shadow-sm account-listings-card">
      <div className="card-body">
        <h2 className="h5 mb-3">Mes données personnelles</h2>

        <p className="text-muted">
          Tu peux télécharger à tout moment l&apos;ensemble des données
          qu&apos;Antunes conserve sur toi (profil, annonces, achats,
          messages). Pour toute autre demande, utilise le{" "}
          <Link to="/mes-donnees">formulaire dédié</Link>. Plus
          d&apos;informations dans notre{" "}
          <Link to="/confidentialite">politique de confidentialité</Link>.
        </p>

        {exportError ? (
          <div className="alert alert-danger py-2" role="alert">
            {exportError}
          </div>
        ) : null}

        <button
          type="button"
          className="btn btn-outline-primary btn-sm mb-4"
          onClick={handleExportClick}
          disabled={isExporting}
        >
          {isExporting ? "Préparation..." : "Télécharger mes données"}
        </button>

        <h3 className="h6">Supprimer mon compte</h3>
        <p className="text-muted small">
          Ton profil, tes annonces en vente et tes conversations seront
          définitivement supprimés. Les commandes sont conservées 10 ans,
          comme l&apos;exige la loi pour les pièces comptables.
        </p>

        {deleteError ? (
          <div className="alert alert-danger py-2" role="alert">
            {deleteError}
          </div>
        ) : null}

        <form className="account-delete-form" onSubmit={handleDeleteSubmit}>
          <label htmlFor="delete-account-password" className="form-label">
            Confirme avec ton mot de passe
          </label>
          <PasswordInput
            id="delete-account-password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-outline-danger btn-sm mt-2"
            disabled={isDeleting || !deletePassword}
          >
            {isDeleting ? "Suppression..." : "Supprimer définitivement mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PersonalDataPanel;
