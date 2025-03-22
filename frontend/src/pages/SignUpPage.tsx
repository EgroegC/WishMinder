import AuthForm from "../components/LoginSignUpForm/LoginSignupForm";

function SignupPage() {
  function handleSignup(email: string, password: string, name?: string) {
    console.log("Signing up with:", name, email, password);
  }

  return (
    <div>
      <AuthForm isSignup={true} onSubmit={handleSignup} />
    </div>
  );
}

export default SignupPage;
