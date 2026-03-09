function Sell() {
  return (
    <div className="container sell-page my-4">
      <section className="sell-hero mb-4">
        <div>
          <p className="sell-kicker mb-2">Publication guidée</p>
          <h1 className="h2 mb-2">Vendre un article</h1>
          <p className="text-muted mb-0">
            Crée une annonce claire, attractive et visible en quelques minutes.
          </p>
        </div>
        <div className="sell-hero-chips">
          <span className="sell-chip">Mise en ligne rapide</span>
          <span className="sell-chip">Conseils intégrés</span>
          <span className="sell-chip">Visibilité optimisée</span>
        </div>
      </section>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <form className="sell-form-card">
            <div className="mb-3">
              <label htmlFor="productImage" className="form-label">
                Télécharger une photo
              </label>
              <input className="form-control" type="file" id="productImage" />
              <div className="form-text">
                Ajoutez l'image principale de votre produit.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="productName" className="form-label">
                Nom du produit
              </label>
              <input
                type="text"
                className="form-control"
                id="productName"
                placeholder="Ex: iPhone 15 Pro"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="productBrand" className="form-label">
                  Marque
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="productBrand"
                  placeholder="Ex: Apple"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="productCondition" className="form-label">
                  État
                </label>
                <select id="productCondition" className="form-select">
                  <option defaultValue>Choisir...</option>
                  <option>Neuf</option>
                  <option>Reconditionné</option>
                  <option>Bon état</option>
                  <option>Occasion</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="productPrice" className="form-label">
                Prix
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  id="productPrice"
                  placeholder="150"
                />
                <span className="input-group-text">€</span>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="productDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="productDescription"
                rows="4"
                placeholder="Décrivez votre produit..."
              ></textarea>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg fx-neon">
                Publier l'annonce
              </button>
            </div>
          </form>
        </div>

        <aside className="col-12 col-lg-4">
          <div className="sell-tips-card h-100">
            <h2 className="h5 mb-3">Conseils pour vendre plus vite</h2>
            <ul className="sell-tips-list mb-0">
              <li>Ajoute 3 photos nettes minimum.</li>
              <li>Donne un titre précis avec modèle complet.</li>
              <li>Indique l’état réel du produit sans ambiguïté.</li>
              <li>Propose un prix cohérent avec le marché.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Sell;
