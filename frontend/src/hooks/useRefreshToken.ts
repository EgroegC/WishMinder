import apiClient from "../services/api-client";
import { AxiosError } from 'axios'
import { useAuth } from "./useAuth";

const useRefreshToken = () => {
    const { setAccessToken } = useAuth();

    const refresh = async () => {
        try {
            const response = await apiClient.post('/api/auth/refresh', {}, { withCredentials: true });

            setAccessToken(response.data.accessToken); 
            return response.data.accessToken; 
        } catch (err) {
            if (err instanceof AxiosError) {
              if (isRefreshTokenInvalidOrExpired(err))
              {
                return null;
              }
          }

            return null;
        }
    };

    return refresh;
};

const isRefreshTokenInvalidOrExpired = (err: AxiosError) => {
  return err?.response?.status === 403 && 
    (err?.response?.data === 'Refresh token expired.' || err?.response?.data === 'Invalid refresh token.')
}

export default useRefreshToken;
