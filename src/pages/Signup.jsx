import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="text-center mb-4">Inscription</h2>

        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Pseudo
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Votre pseudo"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Adresse e-mail
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="nom@exemple.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Votre mot de passe"
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Créer un compte
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Déjà un compte ? <Link to="/login">Connectez-vous</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
