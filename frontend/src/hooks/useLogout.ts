import apiClient from "@/services/api-client";

const useLogout = () => {
    const logout = async () => {
        try {
            await apiClient.post(
                "/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.error("Failed to logout", err);
        }
    };

    return logout;
};

export default useLogout;
