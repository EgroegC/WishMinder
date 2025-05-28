import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";
import { useState } from "react";

function SignupPage() {
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  function handleSignup(email: string, password: string, name?: string) {
    apiClient
      .post("/api/users", { name, email, password })
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          setAuthError("User already registered.");
        } else {
          setAuthError("Something went wrong. Please try again.");
        }
      });
  }

  return (
    <div className="auth-page">
      <AuthForm isSignup={true} onSubmit={handleSignup} authError={authError} />
    </div>
  );
}

export default SignupPage;
