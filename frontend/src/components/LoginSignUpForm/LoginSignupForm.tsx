import React, { useState } from "react";
import "./LoginSignUpForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

interface AuthFormProps {
  isSignup: boolean;
  onSubmit: (email: string, password: string, name?: string) => void;
}

function AuthForm({ isSignup, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill in all fields");
    } else {
      setError("");
      onSubmit(email, password, isSignup ? name : undefined);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="header">{isSignup ? "Sign Up" : "Login"}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
        )}

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <MdEmail className="icon" />
        </div>

        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>

        <div className="register-link">
          {isSignup ? (
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          ) : (
            <p>
              Don't have an account? <Link to="/signup">Register</Link>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default AuthForm;
