import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import "../components/LoginSignUpForm/LoginSignUpForm.css";
import apiClient from "../services/api-client";

function LoginPage() {
  function handleLogin(email: string, password: string) {
    apiClient
      .post("/api/auth", { email, password })
      .then((res) => console.log(res.data));
  }

  return (
    <div>
      <AuthForm isSignup={false} onSubmit={handleLogin} />
    </div>
  );
}

export default LoginPage;
