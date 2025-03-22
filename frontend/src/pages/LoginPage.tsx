import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import "../components/LoginSignUpForm/LoginSignUpForm.css";
import { Link } from "react-router-dom";

function LoginPage() {
  function handleLogin(email: string, password: string) {
    console.log("Logging in with:", email, password);
  }

  return (
    <div className="wrapper-log">
      <AuthForm isSignup={false} onSubmit={handleLogin} />

      <div className="register-link">
        <p>
          Don't have an account? <Link to="/signup">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
