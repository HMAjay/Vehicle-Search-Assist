import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Details() {
  const [name, setName] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const email = localStorage.getItem("verifiedEmail");

  // Same as your "if (!email) redirect"
  useEffect(() => {
    if (!email) {
      alert("Verify email first!");
      navigate("/register");
    }
  }, [email, navigate]);

  const createAccount = async () => {
    if (!name || !vehicleName || !vehicleNumber || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          vehicleName,
          vehicleNumber,
          password,
        }),
      });

      if (res.ok) {
        alert("Account created!");
        localStorage.removeItem("verifiedEmail");
        navigate("/");
      } else {
        const data = await res.json();
        alert(data.message || "Registration failed");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div>
      <h2>Complete Registration</h2>

      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <label>Vehicle Name:</label>
      <input
        type="text"
        value={vehicleName}
        onChange={(e) => setVehicleName(e.target.value)}
      />
      <br /><br />

      <label>Vehicle Number:</label>
      <input
        type="text"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
      />
      <br /><br />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={createAccount}>Register</button>
    </div>
  );
}
