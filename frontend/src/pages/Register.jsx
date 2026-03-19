import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../utils/api";

export default function Register() {
  const [email,   setEmail]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [info,    setInfo]    = useState("");
  const navigate = useNavigate();

  useEffect(() => { localStorage.removeItem("verifiedEmail"); }, []);

  const sendOtp = async () => {
    setError(""); setInfo("");
    if (!email.trim()) { setError("Please enter your email."); return; }
    setLoading(true);
    try {
      await api.sendOtp(email.trim());
      setOtpSent(true);
      setInfo("OTP sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP."); return; }
    setLoading(true);
    try {
      await api.verifyOtp(email.trim(), otp.trim());
      localStorage.setItem("verifiedEmail", email.trim());
      navigate("/details");
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

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">
          {otpSent
            ? `OTP sent to ${email}. Check your inbox.`
            : "We'll verify your email first."}
        </p>

        <div className="auth-form">
          {error && <div className="err-msg">{error}</div>}
          {info  && <div className="ok-msg">{info}</div>}

          <div className="field fade-up d1">
            <label className="label">Email</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !otpSent && sendOtp()}
                disabled={otpSent}
                autoFocus
                style={{ flex: 1 }}
              />
              {!otpSent && (
                <button
                  className="btn btn-ghost"
                  onClick={sendOtp}
                  disabled={loading}
                  style={{ flexShrink: 0 }}
                >
                  {loading
                    ? <span className="spinner spinner-amber" />
                    : "Send OTP"}
                </button>
              )}
            </div>
          </div>

          {otpSent && (
            <>
              <div className="field fade-up d2">
                <label className="label">One-time password</label>
                <input
                  className="input"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && verifyOtp()}
                  autoFocus
                  style={{ fontFamily: "var(--mono)", letterSpacing: "0.2em" }}
                />
              </div>

              <button
                className="btn btn-primary fade-up d3"
                style={{ width: "100%", padding: "13px" }}
                onClick={verifyOtp}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner" /> Verifying…</>
                  : "Verify & continue →"}
              </button>

              <button
                className="btn btn-ghost"
                style={{ width: "100%", fontSize: "0.8rem" }}
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setInfo("");
                  setError("");
                }}
              >
                ← Use a different email
              </button>
            </>
          )}
        </div>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}