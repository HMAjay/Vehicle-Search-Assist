import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import { getInitials } from "../utils/userDisplay";

export default function View() {
  const [vehicle] = useState(() =>
    JSON.parse(localStorage.getItem("vehicleData") || "null"),
  );
  const navigate = useNavigate();
  const me = getUser();

  useEffect(() => {
    if (!vehicle) navigate("/dashboard");
  }, [navigate, vehicle]);

  if (!vehicle) return null;

  const isSelf = vehicle.ownerId === me?._id;
  const initials = getInitials(vehicle.ownerName, "VC");

  return (
    <div className="view-shell">
      <div className="view-card fade-up">
        <div className="view-header">
          <span className="view-tag">Vehicle found</span>
          <p className="view-plate">{vehicle.vehicleNumber}</p>
          <p className="view-model">{vehicle.vehicleName}</p>
        </div>

        <hr className="view-divider" />

        <div className="view-owner">
          <div className="view-avatar">{initials}</div>
          <div className="view-owner-info">
            <p>{vehicle.ownerName}</p>
            <p style={{ fontSize: "1.0rem" }}>Registered Owner</p>
          </div>
        </div>

        <hr className="view-divider" />

        <div className="view-actions" style={{ padding: "20px 28px 28px" }}>
          {isSelf ? (
            <div className="err-msg" style={{ flex: 1, textAlign: "center" }}>
              This is your own vehicle.
            </div>
          ) : (
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: "12px" }}
              onClick={() =>
                navigate(`/chat/${vehicle.ownerId}`, {
                  state: { name: vehicle.ownerName },
                })
              }
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
