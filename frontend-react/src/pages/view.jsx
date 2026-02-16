import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function View() {
  const [vehicle, setVehicle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("vehicleData"));

    if (!data) {
      alert("No vehicle selected");
      navigate("/dashboard");
    } else {
      setVehicle(data);
    }
  }, [navigate]);

  const messageOwner = () => {
    if (!vehicle.ownerId) {
      alert("Owner information missing");
      return;
    }
    navigate(`/chat/${vehicle.ownerId}`);
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  if (!vehicle) return null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "500px",
        background: "#0f172a",
        borderRadius: "18px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        padding: "25px",
        color: "white"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Vehicle Information
        </h2>

        <div style={{
          background: "#1e293b",
          padding: "15px",
          borderRadius: "12px",
          marginBottom: "15px"
        }}>
          <p style={{ margin: "6px 0" }}>
            <strong style={{ color: "#60a5fa" }}>Owner Name:</strong> {vehicle.ownerName}
          </p>
          <p style={{ margin: "6px 0" }}>
            <strong style={{ color: "#60a5fa" }}>Vehicle Name:</strong> {vehicle.vehicleName}
          </p>
        </div>

        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "space-between"
        }}>
          <button
            onClick={messageOwner}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            💬 Message Owner
          </button>

          <button
            onClick={goBack}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#334155",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
        </div>

      </div>
    </div>
  );
}
