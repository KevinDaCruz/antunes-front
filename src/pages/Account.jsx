import { Link } from "react-router-dom";
import { products } from "../data/mockProducts";

function Account() {
  return (
    <div className="container account-page my-4">
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
        <div className="col-12 col-md-4">
          <article className="account-stat-card">
            <p className="account-stat-value mb-1">{products.length}</p>
            <p className="mb-0 text-muted">Annonces actives</p>
          </article>
        </div>
        <div className="col-12 col-md-4">
          <article className="account-stat-card">
            <p className="account-stat-value mb-1">92%</p>
            <p className="mb-0 text-muted">Taux de réponse</p>
          </article>
        </div>
        <div className="col-12 col-md-4">
          <article className="account-stat-card">
            <p className="account-stat-value mb-1">4.9</p>
            <p className="mb-0 text-muted">Note vendeur</p>
          </article>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100 account-profile-card">
            <div className="card-body">
              <h2 className="h5">Profil</h2>
              <p className="mb-2">
                <strong>Pseudo :</strong> KevinTech
              </p>
              <p className="mb-2">
                <strong>Email :</strong> kevin@example.com
              </p>
              <p className="mb-0 text-muted">Membre depuis mars 2026</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm account-listings-card">
            <div className="card-body">
              <h2 className="h5 mb-3">Mes annonces</h2>
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
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.condition}</td>
                        <td>{product.price}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
