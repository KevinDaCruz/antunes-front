import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { apiRequest } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";
import AddressAutocomplete from "../components/AddressAutocomplete";

const INITIAL_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function Account() {
  const { user, token, logout, updateProfile, changePassword } = useAuth();
  const { products, favoriteProducts } = useProducts();
  const navigate = useNavigate();
  const [addressError, setAddressError] = useState("");

  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    pseudo: "",
    email: "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Garde le formulaire synchronisé avec le profil serveur (au chargement et
  // après un enregistrement réussi) sans passer par un effet : on ajuste
  // l'état pendant le rendu, en comparant à la dernière référence connue.
  const [syncedUser, setSyncedUser] = useState(null);
  if (user && user !== syncedUser) {
    setSyncedUser(user);
    setProfileForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      pseudo: user.pseudo ?? "",
      email: user.email ?? "",
    });
  }

  const myListings = user
    ? products.filter((product) => product.seller?._id === user.id)
    : [];

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        setIsLoadingOrders(false);
        return;
      }

      try {
        const data = await apiRequest("/payments/orders", { token });
        setOrders(data.orders);
      } catch {
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    loadOrders();
  }, [token]);

  function handleLogoutClick() {
    logout();
    navigate("/");
  }

  async function handleAddressSelect(address) {
    const result = await updateProfile({ address });
    setAddressError(result.success ? "" : result.error);
  }

  function handleProfileFieldChange(field, value) {
    setProfileForm((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileError("");
    setProfileSuccess("");
    setIsSavingProfile(true);

    const result = await updateProfile(profileForm);

    if (result.success) {
      setProfileSuccess("Modifications enregistrées.");
    } else {
      setProfileError(result.error);
    }

    setIsSavingProfile(false);
  }

  function handlePasswordFieldChange(field, value) {
    setPasswordForm((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setPasswordError("");
    setPasswordSuccess("");
    setIsSavingPassword(true);

    const result = await changePassword(passwordForm);

    if (result.success) {
      setPasswordSuccess("Mot de passe mis à jour.");
      setPasswordForm(INITIAL_PASSWORD_FORM);
    } else {
      setPasswordError(result.error);
    }

    setIsSavingPassword(false);
  }

  if (!user) {
    return (
      <div className="container account-page my-4 text-center">
        <SeoHead title="Mon compte" description="Espace compte Antunes." noIndex />
        <h1 className="h2 mb-3">Mon compte</h1>
        <p className="text-muted mb-4">
          Connecte-toi pour accéder à ton espace vendeur.
        </p>
        <Link to="/login" className="btn btn-primary fx-neon">
          Se connecter
        </Link>
      </div>
    );
  }

  return (
    <div className="container account-page my-4">
      <SeoHead
        title="Mon compte"
        description="Pilote ton activité, tes annonces et tes performances sur Antunes."
        noIndex
      />

      <section className="account-hero mb-4">
        <div>
          <p className="account-kicker mb-2">Espace vendeur</p>
          <h1 className="h2 mb-2">Mon compte</h1>
          <p className="text-muted mb-0">
            Pilote ton activité, tes annonces et tes performances en un coup
            d&apos;œil.
          </p>
        </div>
        <div className="account-hero-actions">
          <Link to="/sell" className="btn btn-primary fx-neon">
            Déposer une annonce
          </Link>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <article className="account-stat-card">
            <p className="account-stat-value mb-1">{myListings.length}</p>
            <p className="mb-0 text-muted">Annonces actives</p>
          </article>
        </div>
        <div className="col-12 col-md-6">
          <article className="account-stat-card">
            <p className="account-stat-value mb-1">{favoriteProducts.length}</p>
            <p className="mb-0 text-muted">Favoris</p>
          </article>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 account-profile-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Profil</h2>

              {profileError ? (
                <div className="alert alert-danger py-2" role="alert">
                  {profileError}
                </div>
              ) : null}
              {profileSuccess ? (
                <div className="alert alert-success py-2" role="status">
                  {profileSuccess}
                </div>
              ) : null}

              <form onSubmit={handleProfileSubmit}>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label htmlFor="account-firstName" className="form-label">
                      Prénom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="account-firstName"
                      value={profileForm.firstName}
                      onChange={(event) =>
                        handleProfileFieldChange("firstName", event.target.value)
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="account-lastName" className="form-label">
                      Nom
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="account-lastName"
                      value={profileForm.lastName}
                      onChange={(event) =>
                        handleProfileFieldChange("lastName", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="account-pseudo" className="form-label">
                    Pseudo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="account-pseudo"
                    value={profileForm.pseudo}
                    onChange={(event) =>
                      handleProfileFieldChange("pseudo", event.target.value)
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="account-email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="account-email"
                    value={profileForm.email}
                    onChange={(event) =>
                      handleProfileFieldChange("email", event.target.value)
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm mb-3"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Enregistrement..." : "Enregistrer"}
                </button>
              </form>

              <div className="mb-3">
                <label htmlFor="account-address" className="form-label">
                  <strong>Adresse de livraison</strong>
                </label>
                {user.address ? (
                  <p className="text-muted mb-2">{user.address}</p>
                ) : null}
                {addressError ? (
                  <div className="alert alert-danger py-2" role="alert">
                    {addressError}
                  </div>
                ) : null}
                <AddressAutocomplete
                  id="account-address"
                  initialValue={user.address ?? ""}
                  onSelect={handleAddressSelect}
                />
              </div>

              <hr className="my-3" />

              <h2 className="h6 mb-3">Changer le mot de passe</h2>

              {passwordError ? (
                <div className="alert alert-danger py-2" role="alert">
                  {passwordError}
                </div>
              ) : null}
              {passwordSuccess ? (
                <div className="alert alert-success py-2" role="status">
                  {passwordSuccess}
                </div>
              ) : null}

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-2">
                  <label htmlFor="current-password" className="form-label">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="current-password"
                    value={passwordForm.currentPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange(
                        "currentPassword",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="new-password" className="form-label">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="new-password"
                    value={passwordForm.newPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange("newPassword", event.target.value)
                    }
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirm-new-password" className="form-label">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirm-new-password"
                    value={passwordForm.confirmNewPassword}
                    onChange={(event) =>
                      handlePasswordFieldChange(
                        "confirmNewPassword",
                        event.target.value,
                      )
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-outline-primary btn-sm mb-3"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword
                    ? "Enregistrement..."
                    : "Changer le mot de passe"}
                </button>
              </form>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLogoutClick}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm account-listings-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Mes annonces</h2>
              {myListings.length === 0 ? (
                <p className="text-muted mb-0">
                  Tu n&apos;as encore publié aucune annonce.{" "}
                  <Link to="/sell">Vends ton premier article</Link>.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 account-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>État</th>
                        <th>Prix</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myListings.map((product) => (
                        <tr key={product._id}>
                          <td>{product.name}</td>
                          <td>{product.condition}</td>
                          <td>{product.price}€</td>
                          <td>
                            <span className="badge text-bg-success account-status-badge">
                              En ligne
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-12">
          <div className="card border-0 shadow-sm account-listings-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Mes achats</h2>
              {isLoadingOrders ? (
                <p className="text-muted mb-0">Chargement...</p>
              ) : orders.length === 0 ? (
                <p className="text-muted mb-0">
                  Tu n&apos;as encore rien acheté.{" "}
                  <Link to="/catalog">Explore le catalogue</Link>.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0 account-table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Vendeur</th>
                        <th>Prix</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>{order.product?.name}</td>
                          <td>{order.seller?.pseudo}</td>
                          <td>{order.amountTotal}€</td>
                          <td>
                            <span
                              className={`badge account-status-badge text-bg-${
                                order.status === "paid"
                                  ? "success"
                                  : order.status === "failed"
                                    ? "danger"
                                    : "secondary"
                              }`}
                            >
                              {order.status === "paid"
                                ? "Payée"
                                : order.status === "failed"
                                  ? "Échouée"
                                  : "En attente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
