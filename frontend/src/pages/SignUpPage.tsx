import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api-client";

function SignupPage() {
  const navigate = useNavigate();

  function handleSignup(email: string, password: string, name?: string) {
    apiClient
      .post("/api/users", { name, email, password })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="auth-page">
      <AuthForm isSignup={true} onSubmit={handleSignup} />
    </div>
  );
}

export default SignupPage;
