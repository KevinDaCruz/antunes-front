function Sell() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <h2 className="text-center mb-4">Vendre un article</h2>
        <p className="text-center text-muted mb-4">
          Publiez une nouvelle annonce pour votre produit électronique.
        </p>

        <form>
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
            <button type="submit" className="btn btn-primary btn-lg">
              Publier l'annonce
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Sell;
