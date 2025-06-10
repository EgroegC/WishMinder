import AuthForm from "../components/loginSignUpForm/LoginSignupForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiClient from "@/services/api-client";

function SignupPage() {
    const [authError, setAuthError] = useState("");
    const navigate = useNavigate();

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
                console.error("Failed to clean up on signup page", err);
            }
        };

        cleanUp();
    }, []);

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
        console.log(email, password, name);
    }

    return (
        <div className="auth-page">
            <AuthForm isSignup={true} onSubmit={handleSignup} authError={authError} />
        </div>
    );
}

export default SignupPage;
