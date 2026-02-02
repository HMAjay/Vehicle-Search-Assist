import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Same as: localStorage.removeItem("verifiedEmail")
  useEffect(() => {
    localStorage.removeItem("verifiedEmail");
  }, []);

  const sendOtp = async () => {
    if (!email.trim()) {
      alert("Enter email first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      alert("OTP sent to email");
      setOtpSent(true);
    } catch {
      alert("Server error");
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Store verified email
      localStorage.setItem("verifiedEmail", email);

      // Move to details page
      navigate("/details");
    } catch {
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <label>Email:</label>
      <input
        type="email"
        placeholder="Enter Mail ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={sendOtp} disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <br /><br />

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        disabled={!otpSent}
      />

      <button onClick={verifyOtp} disabled={!otpSent}>
        Verify
      </button>
    </div>
  );
}
