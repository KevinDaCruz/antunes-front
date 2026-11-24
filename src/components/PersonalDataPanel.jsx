import { Download, Trash2 } from "lucide-react";
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
    <section className="card p-6" aria-labelledby="personal-data-title">
      <h2 id="personal-data-title" className="text-2xl">
        Mes données personnelles
      </h2>

      <p className="mt-2 text-sm font-semibold text-ink-soft">
        Tu peux télécharger à tout moment l&apos;ensemble des données
        qu&apos;Antunes conserve sur toi (profil, annonces, achats, messages).
        Pour toute autre demande, utilise le{" "}
        <Link to="/mes-donnees" className="link">
          formulaire dédié
        </Link>
        . Plus d&apos;informations dans notre{" "}
        <Link to="/confidentialite" className="link">
          politique de confidentialité
        </Link>
        .
      </p>

      {exportError ? (
        <div className="alert-error mt-4" role="alert">
          {exportError}
        </div>
      ) : null}

      <button
        type="button"
        className="btn-white mt-4 w-full"
        onClick={handleExportClick}
        disabled={isExporting}
      >
        <Download className="size-4.5" aria-hidden="true" />
        {isExporting ? "Préparation..." : "Télécharger mes données"}
      </button>

      <h3 className="mt-8 text-xl">Supprimer mon compte</h3>
      <p className="mt-1 text-sm font-semibold text-ink-soft">
        Ton profil, tes annonces en vente et tes conversations seront
        définitivement supprimés. Les commandes sont conservées 10 ans, comme
        l&apos;exige la loi pour les pièces comptables.
      </p>

      {deleteError ? (
        <div className="alert-error mt-4" role="alert">
          {deleteError}
        </div>
      ) : null}

      <form className="mt-4 space-y-3" onSubmit={handleDeleteSubmit}>
        <label htmlFor="delete-account-password" className="label">
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
          className="btn w-full bg-white !text-[#a3131b]"
          disabled={isDeleting || !deletePassword}
        >
          <Trash2 className="size-4.5" aria-hidden="true" />
          {isDeleting
            ? "Suppression..."
            : "Supprimer définitivement mon compte"}
        </button>
      </form>
    </section>
  );
}

export default PersonalDataPanel;
