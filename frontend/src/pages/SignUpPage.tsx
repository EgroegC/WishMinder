import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();

  function handleSignup(email: string, password: string, name?: string) {
    console.log("Signing up with:", name, email, password);
    navigate("/login");
  }

  return (
    <div>
      <AuthForm isSignup={true} onSubmit={handleSignup} />
    </div>
  );
}

export default SignupPage;
