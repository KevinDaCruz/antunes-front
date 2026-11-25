import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Protège les pages réservées aux membres : un visiteur est renvoyé vers la
// connexion, puis ramené sur la page demandée une fois connecté.
function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

export default RequireAuth;
