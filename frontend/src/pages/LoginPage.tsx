import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import "../components/LoginSignUpForm/LoginSignUpForm.css";
import apiClient from "../services/api-client";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAccessToken } = useAuth();
  const [authError, setAuthError] = useState("");
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
      .catch((err) => {
        if (err.response?.status === 400) {
          setAuthError("Invalid email or password.");
        } else {
          setAuthError("Something went wrong. Please try again.");
        }
      });
  }

  return (
    <div className="auth-page">
      <AuthForm isSignup={false} onSubmit={handleLogin} authError={authError} />
    </div>
  );
}

export default LoginPage;
