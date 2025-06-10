import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";

const PersistLogin = () => {
    const { accessToken, setAccessToken } = useAuth();
    const refresh = useRefreshToken();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyRefreshToken = async () => {
            if (!accessToken) {
                try {
                    const newToken = await refresh();
                    setAccessToken(newToken);
                } catch (err) {
                    console.error("Silent token refresh failed:", err);
                }
            }
            setIsLoading(false);
        };

        verifyRefreshToken();
    }, [accessToken, refresh, setAccessToken]);

    if (isLoading) return <p>Loading...</p>;

    return <Outlet />;
};

export default PersistLogin;
