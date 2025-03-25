import { Navigate, Outlet } from "react-router-dom"; // To redirect the user
import { useAuth } from "../hooks/useAuth"; // To use the access token from context

const RequireAuth = () => {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="login" replace />;
};

export default RequireAuth;
