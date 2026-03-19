import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { getUser, clearUser } from "../utils/auth";
import CarAnimation from "../components/CarAnimation";
import ChatAnimation from "../components/ChatAnimation";

function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box fade-up">
        <p className="modal-eyebrow">Sign out</p>
        <p className="modal-title">Are you sure?</p>
        <p className="modal-sub">You'll need to sign in again to access your account.</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" style={{ flex: 1, padding: "11px" }} onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1, padding: "11px" }} onClick={onConfirm}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [vehicleNumber, setVehicleNumber]     = useState("");
  const [unreadCount, setUnreadCount]         = useState(0);
  const [searching, setSearching]             = useState(false);
  const [error, setError]                     = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfile, setShowProfile]         = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = getUser();
  const registered = location.state?.registered ?? false;

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

  useEffect(() => {
    const handler = (e) => { if (!e.target.closest(".profile-anchor")) setShowProfile(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => { clearUser(); navigate("/"); };

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
      setError(err.message === "Vehicle not found"
        ? `No vehicle registered under "${vnum}".`
        : err.message);
    } finally {
      setSearching(false);
    }
  };

  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?";

  return (
    <div className="dash-shell">
      {showSignOutModal && <SignOutModal onConfirm={handleSignOut} onCancel={() => setShowSignOutModal(false)} />}

      {/* Topnav */}
      <nav className="topnav">
        <span className="topnav-brand">
          <img src="/logo.png" alt="logo" style={{ width: 32, height: "auto" }} />
          VahanConnect
        </span>
        <div className="topnav-actions">
          <button className="btn btn-ghost" style={{ position: "relative", gap: 6 }} onClick={() => navigate("/inbox")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Inbox
            {unreadCount > 0 && (
              <span className="badge" style={{ position: "absolute", top: -8, right: -8 }}>{unreadCount}</span>
            )}
          </button>

          <button className="btn btn-ghost" onClick={() => setShowSignOutModal(true)}>Sign out</button>

          <div className="profile-anchor" style={{ position: "relative" }}>
            <div className="profile-avatar" onClick={() => setShowProfile(p => !p)}>{initials}</div>

            {showProfile && (
              <div className="profile-dropdown">
                {[
                  { label: "Registered name",  value: user?.name },
                  { label: "Your vehicle",      value: user?.vehicleName },
                  { label: "Plate number",      value: user?.vehicleNumber, mono: true },
                  { label: "Unread messages",   value: unreadCount > 0 ? `${unreadCount} new` : "None", amber: unreadCount > 0 },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="info-tile-label">{item.label}</p>
                    <p className="info-tile-value" style={{
                      fontFamily:    item.mono  ? "var(--mono)"  : undefined,
                      letterSpacing: item.mono  ? "0.08em"       : undefined,
                      color:         item.amber ? "var(--amber)" : undefined,
                    }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Body */}
      <main className="dash-body">
        {registered && <div className="ok-msg fade-up" style={{ marginBottom: 24 }}>🎉 Account created successfully. Welcome to VahanConnect!</div>}

        <p className="dash-greeting fade-up">Hello, {user?.name?.split(" ")[0]}</p>
        <h1 className="dash-title fade-up d1">Find any <span>vehicle</span><br />owner instantly.</h1>

        <div className="fade-up d1" style={{ marginBottom: -12, marginLeft: 8 }}>
          <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
            <path d="M8 6 C6 28 18 44 38 56" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" fill="none"
              strokeDasharray="120" strokeDashoffset="120" style={{ animation: "drawArrow 0.8s ease 0.3s forwards" }} />
            <path d="M30 52 L38 56 L36 46" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
              style={{ animation: "drawArrow 0.4s ease 1s forwards", strokeDasharray: 30, strokeDashoffset: 30 }} />
          </svg>
        </div>

        <div className="fade-up d2">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Enter vehicle number…"
              value={vehicleNumber}
              onChange={(e) => { setVehicleNumber(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && searchVehicle()}
              autoFocus
            />
            <button className="btn btn-primary" onClick={searchVehicle} disabled={searching} style={{ padding: "13px 22px", fontSize: "0.9rem" }}>
              {searching ? <><span className="spinner" /> Searching…</> : "Search"}
            </button>
          </div>
          {error && <div className="err-msg">{error}</div>}
        </div>

        <div className="fade-up d3 dash-hero">
          <div className="dash-hero-car"><CarAnimation /></div>
          <div className="dash-hero-chat"><ChatAnimation /></div>
        </div>
      </main>
    </div>
  );
}