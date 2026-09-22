import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RequireAuth() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // En dev (npm run dev), on laisse les pages protégées accessibles pour
  // ne pas ralentir les tests. La protection reste active en production
  // (npm run build / npm run preview).
  if (import.meta.env.DEV || isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

export default RequireAuth;
