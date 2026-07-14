import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Auth() {
  const { login, signup } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div>
      <h2>{isSignup ? "Create Account" : "Login to Nexus"}</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={() => (isSignup ? signup(email, password) : login(email, password))}>
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer" }}>
        {isSignup ? "Already have an account? Login" : "Create an account"}
      </p>
    </div>
  );
}