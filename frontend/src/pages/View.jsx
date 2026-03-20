import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";

export default function View() {
  const [vehicle, setVehicle] = useState(null);
  const navigate = useNavigate();
  const me = getUser();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("vehicleData") || "null");
    if (!data) navigate("/dashboard");
    else setVehicle(data);
  }, [navigate]);

  if (!vehicle) return null;

  const isSelf = vehicle.ownerId === me?._id;

  const initials =
    vehicle.ownerName
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="view-shell">
      <div className="view-card fade-up">
        {/* Header */}
        <div className="view-header">
          <span className="view-tag">Vehicle found</span>
          <p className="view-plate">{vehicle.vehicleNumber}</p>
          <p className="view-model">{vehicle.vehicleName}</p>
        </div>

        <hr className="view-divider" />

        {/* Owner */}
        <div className="view-owner">
          <div className="view-avatar">{initials}</div>
          <div className="view-owner-info">
            <p>{vehicle.ownerName}</p>
            <p style={{ fontSize: "1.0rem" }}>Registered Owner</p>
          </div>
        </div>

        <hr className="view-divider" />

        {/* Actions */}
        <div className="view-actions" style={{ padding: "20px 28px 28px" }}>
          {isSelf ? (
            <div className="err-msg" style={{ flex: 1, textAlign: "center" }}>
              This is your own vehicle.
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: "12px" }}
              onClick={() => navigate(`/chat/${vehicle.ownerId}`)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message owner
            </button>
          )}

          <button
            className="btn btn-ghost"
            style={{ flex: 1, padding: "12px" }}
            onClick={() => navigate("/dashboard")}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
