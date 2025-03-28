import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";

const RequireAuth = () => {
  const { accessToken, setAccessToken } = useAuth();
  const refresh = useRefreshToken();
  const [isLoading, setIsLoading] = useState(true);

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

  return accessToken ? <Outlet /> : <Navigate to="login" replace />;
};

export default RequireAuth;
