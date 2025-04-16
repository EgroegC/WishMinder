import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";

const RequireAuth = () => {
  const { accessToken, setAccessToken } = useAuth();
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      if (!accessToken) {
        try {
          const newToken = await refresh();
          setAccessToken(newToken);
        } catch (error) {
          console.error("Token refresh failed", error);
        }
      }
      setIsLoading(false);
    };

    verifyRefreshToken();
  }, [accessToken, refresh, setAccessToken]);

  if (isLoading) return <p>Loading...</p>;

  return accessToken ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
