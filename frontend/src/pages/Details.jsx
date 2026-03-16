import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function PasswordInput({ value, onChange, show, onToggle, placeholder, onKeyDown }) {
  return (
    <div style={{ position: "relative" }}>
      <input
        className="input"
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{ paddingRight: 52 }}
      />
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: "absolute", right: 12, top: "50%",
          transform: "translateY(-50%)",
          background: "none", border: "none",
          cursor: "pointer", color: "var(--text-muted)",
          fontSize: "0.78rem", fontFamily: "var(--mono)",
          padding: "2px 4px", letterSpacing: "0.04em",
        }}
      >
        {show ? "HIDE" : "SHOW"}
      </button>
    </div>
  );
}

export default function Details() {
  const [name,          setName]          = useState("");
  const [vehicleName,   setVehicleName]   = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [password,      setPassword]      = useState("");
  const [confirm,       setConfirm]       = useState("");
  const [showPass,      setShowPass]      = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("verifiedEmail");

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  const createAccount = async () => {
    setError("");
    if (!name || !vehicleName || !vehicleNumber || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await api.register({ email, name, vehicleName, vehicleNumber, password });
      localStorage.removeItem("verifiedEmail");
      navigate("/", { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="auth-shell">
      <div className="auth-card fade-up" style={{ maxWidth: 480 }}>
        <div className="auth-logo">VahanConnect</div>

        <h1 className="auth-title">Almost there</h1>
        <p className="auth-sub">
          Registering{" "}
          <span style={{ color: "var(--amber)", fontFamily: "var(--mono)", fontSize: "0.85em" }}>
            {email}
          </span>
        </p>

        <div className="auth-form">
          {error && <div className="err-msg">{error}</div>}

          <div className="field fade-up d1">
            <label className="label">Full name</label>
            <input
              className="input"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field fade-up d2">
              <label className="label">Vehicle name</label>
              <input
                className="input"
                placeholder="Honda Civic"
                value={vehicleName}
                onChange={e => setVehicleName(e.target.value)}
              />
            </div>
            <div className="field fade-up d2">
              <label className="label">Vehicle number</label>
              <input
                className="input"
                placeholder="MH12AB1234"
                value={vehicleNumber}
                onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                style={{ fontFamily: "var(--mono)", letterSpacing: "0.08em" }}
              />
            </div>
          </div>

          <div className="field fade-up d3">
            <label className="label">Password</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              show={showPass}
              onToggle={() => setShowPass(p => !p)}
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="field fade-up d4">
            <label className="label">Confirm password</label>
            <PasswordInput
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              show={showConfirm}
              onToggle={() => setShowConfirm(p => !p)}
              placeholder="Repeat password"
              onKeyDown={e => e.key === "Enter" && createAccount()}
            />
          </div>

          <button
            className="btn btn-primary fade-up d5"
            style={{ width: "100%", padding: "13px" }}
            onClick={createAccount}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" /> Creating account…</>
              : "Create account →"}
          </button>
        </div>
      </div>
    </div>
  );
}