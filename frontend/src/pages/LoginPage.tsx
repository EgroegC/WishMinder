import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import "../components/LoginSignUpForm/LoginSignUpForm.css";
import apiClient from "../services/api-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuth();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    const cleanUp = async () => {
      try {
        await apiClient.post(
          "/api/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("Failed to clean up on login page", err);
      }
    };

    cleanUp();
  }, []);

  function handleLogin(email: string, password: string) {
    apiClient
      .post("/api/auth", { email, password }, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        navigate(from, { replace: true });
      })
      .catch((err) => console.log(err.message));
  }

  return (
    <div className="auth-page">
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
}

export default LoginPage;
