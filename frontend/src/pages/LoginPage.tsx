import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import "../components/LoginSignUpForm/LoginSignUpForm.css";
import apiClient from "../services/api-client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  function handleLogin(email: string, password: string) {
    apiClient
      .post("/api/auth", { email, password })
      .then((res) => {
        console.log(res.data);
        setAccessToken(res.data.accessToken);
        navigate("/");
      })
      .catch((err) => console.log(err.message));
  }

  return (
    <div>
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
}

export default LoginPage;
