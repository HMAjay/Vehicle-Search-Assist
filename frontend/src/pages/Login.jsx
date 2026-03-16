import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { setUser, setToken } from "../utils/auth";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const justRegistered = location.state?.registered ?? false;

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.login(email.trim(), password);
      setUser(data.user);
      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card fade-up">
        <div className="auth-logo">VahanConnect</div>

        {/* Success toast after registration */}
        {justRegistered && (
          <div className="ok-msg fade-up" style={{ marginBottom: 20 }}>
            🎉 Account created! Sign in to continue.
          </div>
        )}

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub" style={{ marginBottom: 6 }}>Sign in to your account to continue.</p>
        <p style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          marginBottom: 28,
          fontStyle: "italic",
        }}>
          Seamless vehicle owner contact system
        </p>

        <div className="auth-form">
          {error && <div className="err-msg">{error}</div>}

          <div className="field fade-up d1">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
            />
          </div>

          <div className="field fade-up d2">
            <label className="label">Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ paddingRight: 52 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "var(--text-muted)",
                  fontSize: "0.78rem", fontFamily: "var(--mono)",
                  padding: "2px 4px", letterSpacing: "0.04em",
                }}
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary fade-up d3"
            style={{ width: "100%", padding: "13px" }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" /> Signing in…</>
              : "Sign in →"}
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}