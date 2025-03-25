import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function HomePage() {
  const { accessToken } = useAuth();
  const [token, setToken] = useState("");

  return (
    <div>
      <button
        onClick={() => setToken(accessToken ? accessToken : "No token found")}
      >
        Show Token
      </button>
      <p>{token}</p>
    </div>
  );
}

export default HomePage;
