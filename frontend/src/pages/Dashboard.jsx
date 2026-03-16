import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { getUser, clearUser } from "../utils/auth";

// ── Sign out confirmation modal ───────────────────────────────────────────────
function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      backdropFilter: "blur(4px)",
    }}>
      <div className="fade-up" style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-lit)",
        borderRadius: "var(--radius-xl)",
        padding: "32px 28px",
        width: "100%",
        maxWidth: 360,
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        <p style={{
          fontFamily: "var(--mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--amber)",
          marginBottom: 12,
        }}>
          Sign out
        </p>
        <p style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--text-bright)",
          marginBottom: 8,
        }}>
          Are you sure?
        </p>
        <p style={{
          fontSize: "0.875rem",
          color: "var(--text-mid)",
          marginBottom: 28,
        }}>
          You'll need to sign in again to access your account.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn btn-ghost"
            style={{ flex: 1, padding: "11px" }}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: "11px" }}
            onClick={onConfirm}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [vehicleNumber,  setVehicleNumber]  = useState("");
  const [unreadCount,    setUnreadCount]    = useState(0);
  const [searching,      setSearching]      = useState(false);
  const [error,          setError]          = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user     = getUser();

  const [registered] = useState(() => location.state?.registered ?? false);

  const fetchUnread = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { count } = await api.getUnreadCount(user._id);
      setUnreadCount(count);
    } catch { /* silent */ }
  }, [user?._id]);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 6000);
    return () => clearInterval(id);
  }, [fetchUnread]);

  const handleSignOut = () => {
    clearUser();
    navigate("/");
  };

  const searchVehicle = async () => {
    setError("");
    const vnum = vehicleNumber.trim().toUpperCase();
    if (!vnum) { setError("Please enter a vehicle number."); return; }
    setSearching(true);
    try {
      const data = await api.getVehicle(vnum);
      localStorage.setItem("vehicleData", JSON.stringify(data));
      navigate("/view");
    } catch (err) {
      setError(
        err.message === "Vehicle not found"
          ? `No vehicle registered under "${vnum}".`
          : err.message
      );
    } finally {
      setSearching(false);
    }
  };

  const initials = user?.name
    ?.split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className="dash-shell">
      {/* Sign out confirmation */}
      {showSignOutModal && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}

      {/* ── Topnav ── */}
      <nav className="topnav">
        <span className="topnav-brand">
          <img src="/logo.png" alt="logo" style={{ width: 32, height: "auto" }} />VahanConnect</span>

        <div className="topnav-actions">
          <button
            className="btn btn-ghost"
            style={{ position: "relative", gap: 6 }}
            onClick={() => navigate("/inbox")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Inbox
            {unreadCount > 0 && (
              <span className="badge" style={{ position: "absolute", top: -8, right: -8 }}>
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => setShowSignOutModal(true)}
          >
            Sign out
          </button>

          <div style={{
            width: 32, height: 32,
            background: "var(--amber-glow)",
            border: "1px solid rgba(245,166,35,0.35)",
            borderRadius: "50%",
            display: "grid", placeItems: "center",
            fontFamily: "var(--mono)",
            fontSize: "0.7rem", fontWeight: 700,
            color: "var(--amber)",
          }}>
            {initials}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <main className="dash-body">
        {registered && (
          <div className="ok-msg fade-up" style={{ marginBottom: 24 }}>
            🎉 Account created successfully. Welcome to VahanConnect!
          </div>
        )}

        <p className="dash-greeting fade-up">Hello, {user?.name?.split(" ")[0]}</p>
        <h1 className="dash-title fade-up d1">
          Find any <span>vehicle</span><br />owner instantly.
        </h1>

        {/* Search */}
        <div className="fade-up d2">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Enter vehicle number…"
              value={vehicleNumber}
              onChange={e => { setVehicleNumber(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={e => e.key === "Enter" && searchVehicle()}
              autoFocus
            />
            <button
              className="btn btn-primary"
              onClick={searchVehicle}
              disabled={searching}
              style={{ padding: "13px 22px", fontSize: "0.9rem" }}
            >
              {searching
                ? <><span className="spinner" /> Searching…</>
                : "Search"}
            </button>
          </div>
          {error && <div className="err-msg">{error}</div>}
        </div>

        {/* Info tiles */}
        <div className="info-grid fade-up d3">
          <div className="info-tile">
            <p className="info-tile-label">Registered name</p>
            <p className="info-tile-value">{user?.name}</p>
          </div>
          <div className="info-tile">
            <p className="info-tile-label">Your vehicle</p>
            <p className="info-tile-value">{user?.vehicleName}</p>
          </div>
          <div className="info-tile">
            <p className="info-tile-label">Plate number</p>
            <p className="info-tile-value"
              style={{ fontFamily: "var(--mono)", letterSpacing: "0.08em" }}>
              {user?.vehicleNumber}
            </p>
          </div>
          <div className="info-tile">
            <p className="info-tile-label">Unread messages</p>
            <p className="info-tile-value"
              style={{ color: unreadCount > 0 ? "var(--amber)" : "inherit" }}>
              {unreadCount > 0 ? `${unreadCount} new` : "None"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}