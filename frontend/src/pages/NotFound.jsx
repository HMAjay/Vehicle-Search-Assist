import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell">
      <div className="auth-card fade-up" style={{ textAlign: "center" }}>
        <div className="auth-logo">VehicleAssist</div>

        <p style={{
          fontFamily: "var(--mono)",
          fontSize: "4rem",
          fontWeight: 700,
          color: "var(--amber)",
          margin: "0 0 8px",
          lineHeight: 1,
        }}>
          404
        </p>

        <h2 style={{
          fontSize: "1.1rem",
          fontWeight: 500,
          color: "var(--text-bright)",
          marginBottom: 8,
        }}>
          Page not found
        </h2>

        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 28 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <button
          className="btn btn-primary"
          style={{ width: "100%", padding: "13px" }}
          onClick={() => navigate("/")}
        >
          Go home →
        </button>
      </div>
    </div>
  );
}