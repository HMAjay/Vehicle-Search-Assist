import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const verifyPassword = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to dashboard
      navigate("/dashboard");
    } catch (err) {
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <label>Email ID:</label>
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <label>Password:</label>
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={verifyPassword} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <br /><br /><br />

      <Link to="/register">Register?</Link>
    </div>
  );
}
