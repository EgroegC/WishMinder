import "./LoginSignUpForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface AuthFormProps {
  isSignup: boolean;
  onSubmit: (email: string, password: string, name?: string) => void;
}

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .optional(),
  email: z
    .string()
    .min(12, { message: "Email must be at least 12 characters." })
    .email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." }),
});

function AuthForm({ isSignup, onSubmit }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onFormSubmit = (data: FieldValues) => {
    onSubmit(data.email, data.password, isSignup ? data.name : undefined);
  };

  return (
    <div className="wrapper">
      <h1 className="header">{isSignup ? "Sign Up" : "Login"}</h1>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {isSignup && (
          <div className="input-box">
            <input
              {...register("name")}
              type="text"
              placeholder="Username"
              id="name"
              name="name"
              required
            />
            <FaUser className="icon" />
            {errors.name && (
              <p className="text-danger">{errors.name.message}</p>
            )}
          </div>
        )}

        <div className="input-box">
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            id="email"
            name="email"
            required
          />
          <MdEmail className="icon" />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="input-box">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            required
          />
          <FaLock className="icon" />
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
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
