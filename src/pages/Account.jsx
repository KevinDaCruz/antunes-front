import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { apiRequest, ApiError } from "../utils/apiClient";
import SeoHead from "../components/SeoHead";
import AddressAutocomplete from "../components/AddressAutocomplete";
import PasswordInput from "../components/PasswordInput";
import PasswordRequirements from "../components/PasswordRequirements";
import EmailVerificationNotice from "../components/EmailVerificationNotice";
import PersonalDataPanel from "../components/PersonalDataPanel";
import ConditionBadge from "../components/ConditionBadge";
import { formatPrice } from "../utils/formatPrice";
import { initials } from "../utils/initials";
import { LogOut, Plus } from "lucide-react";
import { isPasswordValid } from "../utils/passwordRules";

const ORDER_STATUS = {
  paid: { label: "Payée", tint: "bg-mint" },
  failed: { label: "Échouée", tint: "bg-[#ffd9dc]" },
  pending: { label: "En attente", tint: "bg-white" },
};

const INITIAL_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

function Account() {
  const { user, token, logout, updateProfile, changePassword } = useAuth();
  const { favoriteProducts, withdrawProduct } = useProducts();
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

  const [myListings, setMyListings] = useState([]);
  const activeListingsCount = myListings.filter(
    (product) => product.status !== "sold" && product.status !== "withdrawn",
  ).length;
  // Retrait en deux temps : un premier clic demande confirmation, pour éviter
  // de retirer une annonce par erreur.
  const [listingToWithdraw, setListingToWithdraw] = useState(null);
  const [withdrawError, setWithdrawError] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  async function handleConfirmWithdraw(productId) {
    setWithdrawError("");
    setIsWithdrawing(true);

    try {
      await withdrawProduct(productId);
      setMyListings((listings) =>
        listings.map((listing) =>
          listing._id === productId
            ? { ...listing, status: "withdrawn" }
            : listing,
        ),
      );
      setListingToWithdraw(null);
    } catch (error) {
      setWithdrawError(
        error instanceof ApiError
          ? error.message
          : "Impossible de retirer l'annonce pour le moment.",
      );
    } finally {
      setIsWithdrawing(false);
    }
  }

  useEffect(() => {
    async function loadMyListings() {
      if (!token) {
        return;
      }

      try {
        const data = await apiRequest("/products/mine", { token });
        setMyListings(data.products);
      } catch {
        setMyListings([]);
      }
    }

    loadMyListings();
  }, [token]);

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

    if (!isPasswordValid(passwordForm.newPassword)) {
      setPasswordError(
        "Le mot de passe ne respecte pas toutes les règles indiquées.",
      );
      return;
    }

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
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <SeoHead
          title="Mon compte"
          description="Espace compte Antunes."
          noIndex
        />
        <h1 className="text-5xl">Mon compte</h1>
        <p className="mt-4 font-semibold text-ink-soft">
          Connecte-toi pour accéder à ton espace vendeur.
        </p>
        <Link to="/login" className="btn-pink mt-8">
          Se connecter
        </Link>
      </div>
    );
  }

  const soldCount = myListings.length - activeListingsCount;
  const greetingName = user.firstName || user.pseudo;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <SeoHead
        title="Mon compte"
        description="Pilote ton activité, tes annonces et tes performances sur Antunes."
        noIndex
      />

      <div className="flex flex-wrap items-center gap-5">
        <span className="grid size-20 place-items-center rounded-full border-3 border-ink bg-yellow text-3xl font-black text-ink shadow-brutal">
          {initials(user)}
        </span>
        <div>
          <p className="eyebrow">Espace vendeur</p>
          <h1 className="mt-2 text-5xl">Salut {greetingName}&nbsp;!</h1>
        </div>
        <Link to="/sell" className="btn-pink ml-auto">
          <Plus className="size-4.5" aria-hidden="true" />
          Déposer une annonce
        </Link>
      </div>

      <div className="mt-8">
        <EmailVerificationNotice reason="Tu pourras ensuite publier des annonces." />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {[
          {
            value: activeListingsCount,
            label: "Annonces actives",
            tint: "bg-yellow",
          },
          { value: soldCount, label: "Annonces vendues", tint: "bg-mint" },
          {
            value: favoriteProducts.length,
            label: "Favoris",
            tint: "bg-pink-light",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl p-6 text-ink brutal ${stat.tint}`}
          >
            <p className="text-5xl font-black">{stat.value}</p>
            <p className="mt-1 font-extrabold">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="card p-7" aria-labelledby="my-listings-title">
            <h2 id="my-listings-title" className="text-3xl">
              Mes annonces
            </h2>
            {myListings.length === 0 ? (
              <p className="mt-4 font-semibold text-ink-soft">
                Tu n&apos;as encore publié aucune annonce.{" "}
                <Link to="/sell" className="link">
                  Vends ton premier article
                </Link>
                .
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                {withdrawError ? (
                  <div className="alert-error mb-4" role="alert">
                    {withdrawError}
                  </div>
                ) : null}
                <table className="w-full min-w-[640px] text-left text-[15px]">
                  <thead>
                    <tr className="border-b-3 border-ink text-xs tracking-wide uppercase">
                      <th className="py-2">Produit</th>
                      <th>État</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myListings.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b-2 border-ink/15"
                      >
                        <td className="py-3 font-extrabold">
                          <Link
                            to={`/product/${product._id}`}
                            className="hover:underline"
                          >
                            {product.name}
                          </Link>
                        </td>
                        <td>
                          <ConditionBadge condition={product.condition} />
                        </td>
                        <td className="font-black">
                          {formatPrice(product.price)}
                        </td>
                        <td>
                          {product.status === "sold" ? (
                            <span className="rounded-full border-2 border-ink bg-ink px-2.5 py-0.5 text-xs font-extrabold text-cream">
                              Vendu
                            </span>
                          ) : product.status === "withdrawn" ? (
                            <span className="rounded-full border-2 border-ink bg-white px-2.5 py-0.5 text-xs font-extrabold text-ink">
                              Retirée
                            </span>
                          ) : (
                            <span className="rounded-full border-2 border-ink bg-mint px-2.5 py-0.5 text-xs font-extrabold text-ink">
                              En ligne
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {product.status === "sold" ||
                          product.status ===
                            "withdrawn" ? null : listingToWithdraw ===
                            product._id ? (
                            <span className="inline-flex flex-wrap justify-end gap-2">
                              <button
                                type="button"
                                className="btn-pink !px-3 !py-1.5 text-sm"
                                onClick={() =>
                                  handleConfirmWithdraw(product._id)
                                }
                                disabled={isWithdrawing}
                              >
                                {isWithdrawing
                                  ? "Retrait..."
                                  : "Confirmer le retrait"}
                              </button>
                              <button
                                type="button"
                                className="btn-white !px-3 !py-1.5 text-sm"
                                onClick={() => setListingToWithdraw(null)}
                              >
                                Annuler
                              </button>
                            </span>
                          ) : (
                            <span className="inline-flex flex-wrap justify-end gap-2">
                              <Link
                                to={`/sell/${product._id}`}
                                className="btn-white !px-3 !py-1.5 text-sm"
                                aria-label={`Modifier l'annonce ${product.name}`}
                              >
                                Modifier
                              </Link>
                              <button
                                type="button"
                                className="btn-white !px-3 !py-1.5 text-sm"
                                onClick={() =>
                                  setListingToWithdraw(product._id)
                                }
                                aria-label={`Retirer l'annonce ${product.name}`}
                              >
                                Retirer
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card p-7" aria-labelledby="my-orders-title">
            <h2 id="my-orders-title" className="text-3xl">
              Mes achats
            </h2>
            {isLoadingOrders ? (
              <p className="mt-4 font-semibold">Chargement...</p>
            ) : orders.length === 0 ? (
              <p className="mt-4 font-semibold text-ink-soft">
                Tu n&apos;as encore rien acheté.{" "}
                <Link to="/catalog" className="link">
                  Explore le catalogue
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="flex flex-wrap items-center gap-4 rounded-xl border-2 border-ink bg-cream p-4 text-ink"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold">{order.product?.name}</p>
                      <p className="text-sm font-semibold text-ink-muted">
                        Vendu par {order.seller?.pseudo} · frais de protection
                        inclus
                      </p>
                    </div>
                    <span
                      className={`rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold ${ORDER_STATUS[order.status]?.tint ?? "bg-white"}`}
                    >
                      {ORDER_STATUS[order.status]?.label ?? "En attente"}
                    </span>
                    <p className="text-xl font-black">
                      {formatPrice(order.amountTotal)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6" aria-labelledby="profile-title">
            <h2 id="profile-title" className="text-2xl">
              Profil
            </h2>
            {profileError ? (
              <div className="alert-error mt-4" role="alert">
                {profileError}
              </div>
            ) : null}
            {profileSuccess ? (
              <div className="alert-success mt-4" role="status">
                {profileSuccess}
              </div>
            ) : null}
            <form className="mt-4 space-y-4" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="account-firstName" className="label">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="field"
                    id="account-firstName"
                    value={profileForm.firstName}
                    onChange={(event) =>
                      handleProfileFieldChange("firstName", event.target.value)
                    }
                  />
                </div>
                <div>
                  <label htmlFor="account-lastName" className="label">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="field"
                    id="account-lastName"
                    value={profileForm.lastName}
                    onChange={(event) =>
                      handleProfileFieldChange("lastName", event.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <label htmlFor="account-pseudo" className="label">
                  Pseudo
                </label>
                <input
                  type="text"
                  className="field"
                  id="account-pseudo"
                  value={profileForm.pseudo}
                  onChange={(event) =>
                    handleProfileFieldChange("pseudo", event.target.value)
                  }
                />
              </div>
              <div>
                <label htmlFor="account-email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  className="field"
                  id="account-email"
                  value={profileForm.email}
                  onChange={(event) =>
                    handleProfileFieldChange("email", event.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="btn-ink w-full"
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Enregistrement..." : "Enregistrer"}
              </button>
            </form>

            <div className="mt-6">
              <label htmlFor="account-address" className="label">
                Adresse de livraison
              </label>
              {user.address ? (
                <p className="mb-2 text-sm font-semibold text-ink-soft">
                  {user.address}
                </p>
              ) : null}
              {addressError ? (
                <div className="alert-error mb-2" role="alert">
                  {addressError}
                </div>
              ) : null}
              <AddressAutocomplete
                id="account-address"
                initialValue={user.address ?? ""}
                onSelect={handleAddressSelect}
              />
            </div>
          </section>

          <section className="card p-6" aria-labelledby="password-title">
            <h2 id="password-title" className="text-2xl">
              Changer le mot de passe
            </h2>
            {passwordError ? (
              <div className="alert-error mt-4" role="alert">
                {passwordError}
              </div>
            ) : null}
            {passwordSuccess ? (
              <div className="alert-success mt-4" role="status">
                {passwordSuccess}
              </div>
            ) : null}
            <form className="mt-4 space-y-4" onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="current-password" className="label">
                  Mot de passe actuel
                </label>
                <PasswordInput
                  id="current-password"
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(event) =>
                    handlePasswordFieldChange(
                      "currentPassword",
                      event.target.value,
                    )
                  }
                />
              </div>
              <div>
                <label htmlFor="new-password" className="label">
                  Nouveau mot de passe
                </label>
                <PasswordInput
                  id="new-password"
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    handlePasswordFieldChange("newPassword", event.target.value)
                  }
                  aria-describedby="new-password-requirements"
                />
                <PasswordRequirements
                  id="new-password-requirements"
                  password={passwordForm.newPassword}
                />
              </div>
              <div>
                <label htmlFor="confirm-new-password" className="label">
                  Confirmer le nouveau mot de passe
                </label>
                <PasswordInput
                  id="confirm-new-password"
                  autoComplete="new-password"
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
                className="btn-white w-full"
                disabled={isSavingPassword}
              >
                {isSavingPassword
                  ? "Enregistrement..."
                  : "Changer le mot de passe"}
              </button>
            </form>
          </section>

          <PersonalDataPanel />

          <button
            type="button"
            className="btn-white w-full"
            onClick={handleLogoutClick}
          >
            <LogOut className="size-4.5" aria-hidden="true" />
            Se déconnecter
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Account;
