import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="container my-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Connexion</h2>

          <form>
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
                Se connecter
              </button>
            </div>
          </form>

          <p className="text-center mt-3">
            Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
