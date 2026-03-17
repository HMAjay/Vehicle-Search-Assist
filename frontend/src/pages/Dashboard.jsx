import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { getUser, clearUser } from "../utils/auth";

// ── Sign out confirmation modal ───────────────────────────────────────────────
function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="fade-up"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-lit)",
          borderRadius: "var(--radius-xl)",
          padding: "32px 28px",
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--amber)",
            marginBottom: 12,
          }}
        >
          Sign out
        </p>
        <p
          style={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "var(--text-bright)",
            marginBottom: 8,
          }}
        >
          Are you sure?
        </p>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-mid)",
            marginBottom: 28,
          }}
        >
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

// ── Car + Tree Animation ──────────────────────────────────────────────────────
function CarAnimation() {
  return (
    <div
      style={{
        background: "var(--bg-void)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        .car-body-anim {
          animation: driveIn 1.2s cubic-bezier(0.22,1,0.36,1) 0.3s both,
                     idleBob 2.4s ease-in-out 1.6s infinite;
          transform-origin: center bottom;
        }
        @keyframes driveIn {
          from { transform: translateX(-380px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes idleBob {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
        .wheel-anim {
          animation: wheelSpin 0.35s linear 0.3s 4;
          transform-box: fill-box; transform-origin: center;
        }
        @keyframes wheelSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .glass-hover-anim {
          animation: glassSweep 0.9s cubic-bezier(0.22,1,0.36,1) 1.8s both,
                     glassHover 3s ease-in-out 2.8s infinite;
          transform-origin: 72% 38%;
        }
        @keyframes glassSweep {
          from { transform: translate(60px,-50px) scale(0.6); opacity:0; }
          to   { transform: translate(0,0) scale(1); opacity:1; }
        }
        @keyframes glassHover {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          30%      { transform: translate(-5px,4px) rotate(-3deg); }
          70%      { transform: translate(4px,-4px) rotate(2deg); }
        }
        .scan-a   { animation: scanPulse 1.4s ease-in-out 2.8s infinite; }
        .scan-b   { animation: scanPulse 1.4s ease-in-out 3.0s infinite; }
        .scan-c   { animation: scanPulse 1.4s ease-in-out 3.2s infinite; }
        @keyframes scanPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        .ping-a  { animation: pingOut 2s ease-out 2.8s infinite; transform-box:fill-box; transform-origin:center; }
        .ping-b  { animation: pingOut 2s ease-out 3.5s infinite; transform-box:fill-box; transform-origin:center; }
        @keyframes pingOut { 0%{transform:scale(1);opacity:0.5} 100%{transform:scale(1.7);opacity:0} }
        .found-anim { animation: foundPop 0.5s cubic-bezier(0.22,1,0.36,1) 3s both; }
        @keyframes foundPop {
          from { opacity:0; transform:translateY(6px) scale(0.9); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .tree-l  { animation: treeSway 4s ease-in-out 0.5s infinite; transform-origin: 50% 100%; }
        .tree-r  { animation: treeSway 4.5s ease-in-out 1s infinite; transform-origin: 50% 100%; }
        .tree-sm { animation: treeSway 3.8s ease-in-out 0.2s infinite; transform-origin: 50% 100%; }
        @keyframes treeSway {
          0%,100% { transform: rotate(0deg); }
          30%      { transform: rotate(1.5deg); }
          70%      { transform: rotate(-1.2deg); }
        }
      `}</style>

      <svg
        width="100%"
        viewBox="0 0 640 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="640" height="240" fill="#080b10" />
        <rect x="0" y="196" width="640" height="44" fill="#0d1117" />
        <line
          x1="0"
          y1="196"
          x2="640"
          y2="196"
          stroke="#1f2d3d"
          strokeWidth="1"
        />
        {[30, 100, 170, 240, 310, 380, 450, 520].map((x) => (
          <rect
            key={x}
            x={x}
            y="208"
            width="36"
            height="3"
            rx="1.5"
            fill="#1f2d3d"
          />
        ))}

        {/* Tree left tall */}
        <g className="tree-l" transform="translate(42,0)">
          <rect
            x="18"
            y="148"
            width="8"
            height="48"
            rx="2"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="22"
            cy="118"
            rx="20"
            ry="32"
            fill="#111820"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="22"
            cy="102"
            rx="15"
            ry="24"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
        </g>
        {/* Tree left small */}
        <g className="tree-sm" transform="translate(78,20)">
          <rect
            x="10"
            y="158"
            width="6"
            height="38"
            rx="2"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="13"
            cy="132"
            rx="13"
            ry="26"
            fill="#111820"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="13"
            cy="120"
            rx="10"
            ry="18"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
        </g>
        {/* Tree right tall */}
        <g className="tree-r" transform="translate(556,0)">
          <rect
            x="18"
            y="148"
            width="8"
            height="48"
            rx="2"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="22"
            cy="116"
            rx="22"
            ry="34"
            fill="#111820"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="22"
            cy="98"
            rx="16"
            ry="22"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
        </g>
        {/* Tree right small */}
        <g className="tree-sm" transform="translate(592,18)">
          <rect
            x="9"
            y="158"
            width="6"
            height="38"
            rx="2"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="12"
            cy="134"
            rx="12"
            ry="24"
            fill="#111820"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
          <ellipse
            cx="12"
            cy="122"
            rx="9"
            ry="16"
            fill="#161d27"
            stroke="#1f2d3d"
            strokeWidth="1"
          />
        </g>

        {/* Car */}
        <g className="car-body-anim">
          <rect
            x="100"
            y="142"
            width="280"
            height="54"
            rx="10"
            fill="#161d27"
            stroke="#f5a623"
            strokeWidth="2"
          />
          <path
            d="M148 142 C162 112 196 98 234 96 C272 96 308 108 326 124 L368 142Z"
            fill="#161d27"
            stroke="#f5a623"
            strokeWidth="2"
          />
          <rect
            x="179"
            y="110"
            width="52"
            height="24"
            rx="4"
            fill="#1c2533"
            stroke="#2a3d54"
            strokeWidth="1"
          />
          <rect
            x="236"
            y="110"
            width="52"
            height="24"
            rx="4"
            fill="#1c2533"
            stroke="#2a3d54"
            strokeWidth="1"
          />
          <rect
            x="106"
            y="158"
            width="20"
            height="10"
            rx="3"
            fill="#f5a623"
            opacity="0.9"
          />
          <rect
            x="356"
            y="158"
            width="20"
            height="10"
            rx="3"
            fill="#ef4444"
            opacity="0.7"
          />
          <line
            x1="228"
            y1="142"
            x2="228"
            y2="195"
            stroke="#2a3d54"
            strokeWidth="1"
          />
          <rect
            x="202"
            y="182"
            width="76"
            height="14"
            rx="3"
            fill="#1c2533"
            stroke="#2a3d54"
            strokeWidth="1"
          />
          <text
            x="240"
            y="193"
            textAnchor="middle"
            fontSize="12"
            fill="#8b97a8"
            fontFamily="monospace"
            fontWeight="700"
          >
            KA01BG0007
          </text>
          <g className="wheel-anim">
            <circle
              cx="158"
              cy="198"
              r="22"
              fill="#111820"
              stroke="#f5a623"
              strokeWidth="2.5"
            />
            <circle
              cx="158"
              cy="198"
              r="9"
              fill="#161d27"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
            <line
              x1="158"
              y1="177"
              x2="158"
              y2="219"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
            <line
              x1="137"
              y1="198"
              x2="179"
              y2="198"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
          </g>
          <g className="wheel-anim">
            <circle
              cx="326"
              cy="198"
              r="22"
              fill="#111820"
              stroke="#f5a623"
              strokeWidth="2.5"
            />
            <circle
              cx="326"
              cy="198"
              r="9"
              fill="#161d27"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
            <line
              x1="326"
              y1="177"
              x2="326"
              y2="219"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
            <line
              x1="305"
              y1="198"
              x2="347"
              y2="198"
              stroke="#2a3d54"
              strokeWidth="1.5"
            />
          </g>
        </g>

        {/* Magnifying glass */}
        <g className="glass-hover-anim">
          <circle
            className="ping-a"
            cx="466"
            cy="108"
            r="54"
            stroke="#f5a623"
            strokeWidth="1.5"
            fill="none"
          />
          <circle
            className="ping-b"
            cx="466"
            cy="108"
            r="54"
            stroke="#f5a623"
            strokeWidth="1"
            fill="none"
          />
          <circle
            cx="466"
            cy="108"
            r="54"
            fill="#161d27"
            fillOpacity="0.92"
            stroke="#f5a623"
            strokeWidth="3"
          />
          <line
            className="scan-a"
            x1="424"
            y1="92"
            x2="506"
            y2="92"
            stroke="#f5a623"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            className="scan-b"
            x1="418"
            y1="108"
            x2="512"
            y2="108"
            stroke="#f5a623"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            className="scan-c"
            x1="424"
            y1="124"
            x2="506"
            y2="124"
            stroke="#f5a623"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="506"
            y1="150"
            x2="540"
            y2="184"
            stroke="#f5a623"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* Found badge */}
        <g className="found-anim">
          <rect
            x="414"
            y="174"
            width="66"
            height="22"
            rx="11"
            fill="#111820"
            stroke="#22c55e"
            strokeWidth="1.5"
          />
          <text
            x="447"
            y="189"
            textAnchor="middle"
            fontSize="9"
            fill="#22c55e"
            fontFamily="monospace"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            FOUND
          </text>
        </g>
      </svg>
    </div>
  );
}

// ── Chat Animation ────────────────────────────────────────────────────────────
const MESSAGES = [
  {
    id: "b1",
    from: "them",
    text: "Hi, your car is blocking the exit.",
    time: "9:41 AM",
  },
  {
    id: "b2",
    from: "me",
    text: "Sorry! Moving it right now.",
    time: "9:42 AM",
  },
  {
    id: "b3",
    from: "them",
    text: "Thank you, appreciate it!",
    time: "9:42 AM",
  },
  { id: "b4", from: "me", text: "No problem at all :)", time: "9:43 AM" },
];

function ChatAnimation() {
  const [visible, setVisible] = useState([]);
  const [showTyping, setShowTyping] = useState(false);
  const timersRef = useRef([]);

  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  const runLoop = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setVisible([]);
    setShowTyping(false);
    schedule(() => setVisible(["b1"]), 600);
    schedule(() => setShowTyping(true), 1400);
    schedule(() => {
      setShowTyping(false);
      setVisible((v) => [...v, "b2"]);
    }, 2600);
    schedule(() => setVisible((v) => [...v, "b3"]), 3600);
    schedule(() => setShowTyping(true), 4500);
    schedule(() => {
      setShowTyping(false);
      setVisible((v) => [...v, "b4"]);
    }, 5600);
    schedule(runLoop, 8200);
  }, []);

  useEffect(() => {
    runLoop();
    return () => timersRef.current.forEach(clearTimeout);
  }, [runLoop]);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-lit)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        animation: "floatPhone 4s ease-in-out infinite",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "var(--amber)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.15)",
            display: "grid",
            placeItems: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#0d0d0d",
            flexShrink: 0,
            fontFamily: "var(--mono)",
          }}
        >
          RS
        </div>
        <div>
          <p
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#0d0d0d",
              margin: 0,
            }}
          >
            Rahul Sharma
          </p>
          <p
            style={{
              fontSize: "0.65rem",
              color: "rgba(0,0,0,0.55)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#065f46",
                display: "inline-block",
              }}
            />
            online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          padding: "12px 10px",
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          gap: 7,
        }}
      >
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.from === "me" ? "flex-end" : "flex-start",
              background:
                msg.from === "me" ? "var(--amber)" : "var(--bg-raised)",
              border: msg.from === "me" ? "none" : "1px solid var(--border)",
              borderRadius:
                msg.from === "me" ? "12px 2px 12px 12px" : "2px 12px 12px 12px",
              padding: "8px 11px",
              maxWidth: "88%",
              opacity: visible.includes(msg.id) ? 1 : 0,
              transform: visible.includes(msg.id)
                ? "translateY(0)"
                : "translateY(8px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                color: msg.from === "me" ? "#0d0d0d" : "var(--text-bright)",
                margin: 0,
                fontWeight: msg.from === "me" ? 500 : 400,
              }}
            >
              {msg.text}
            </p>
            <p
              style={{
                fontSize: "0.6rem",
                color:
                  msg.from === "me" ? "rgba(0,0,0,0.45)" : "var(--text-muted)",
                margin: "3px 0 0",
                textAlign: "right",
                fontFamily: "var(--mono)",
              }}
            >
              {msg.time}
            </p>
          </div>
        ))}

        {/* Typing dots */}
        <div
          style={{
            alignSelf: "flex-start",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            borderRadius: "2px 12px 12px 12px",
            padding: "10px 14px",
            display: "flex",
            gap: 5,
            alignItems: "center",
            opacity: showTyping ? 1 : 0,
            transform: showTyping ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--text-muted)",
                display: "inline-block",
                animation: showTyping
                  ? `dotBounce 1s ease-in-out ${delay}s infinite`
                  : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div
        style={{
          margin: "0 10px 10px",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: 999,
          padding: "8px 8px 8px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            fontFamily: "var(--sans)",
          }}
        >
          Type a message…
        </span>
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "var(--amber)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 5h8M6 2l3 3-3 3"
              stroke="#0d0d0d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [registered] = useState(() => location.state?.registered ?? false);

  const fetchUnread = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { count } = await api.getUnreadCount(user._id);
      setUnreadCount(count);
    } catch {
      /* silent */
    }
  }, [user?._id]);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 6000);
    return () => clearInterval(id);
  }, [fetchUnread]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".profile-anchor")) setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSignOut = () => {
    clearUser();
    navigate("/");
  };

  const searchVehicle = async () => {
    setError("");
    const vnum = vehicleNumber.trim().toUpperCase();
    if (!vnum) {
      setError("Please enter a vehicle number.");
      return;
    }
    setSearching(true);
    try {
      const data = await api.getVehicle(vnum);
      localStorage.setItem("vehicleData", JSON.stringify(data));
      navigate("/view");
    } catch (err) {
      setError(
        err.message === "Vehicle not found"
          ? `No vehicle registered under "${vnum}".`
          : err.message,
      );
    } finally {
      setSearching(false);
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="dash-shell">
      <style>{`
        @keyframes floatPhone {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes dotBounce {
          0%,60%,100% { transform: translateY(0); }
          30%          { transform: translateY(-5px); }
        }
      `}</style>

      {showSignOutModal && (
        <SignOutModal
          onConfirm={handleSignOut}
          onCancel={() => setShowSignOutModal(false)}
        />
      )}

      {/* ── Topnav ── */}
      <nav className="topnav">
        <span className="topnav-brand">
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: 32, height: "auto" }}
          />
          VahanConnect
        </span>
        <div className="topnav-actions">
          <button
            className="btn btn-ghost"
            style={{ position: "relative", gap: 6 }}
            onClick={() => navigate("/inbox")}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Inbox
            {unreadCount > 0 && (
              <span
                className="badge"
                style={{ position: "absolute", top: -8, right: -8 }}
              >
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

          <div className="profile-anchor" style={{ position: "relative" }}>
            <div
              onClick={() => setShowProfile((p) => !p)}
              style={{
                width: 32,
                height: 32,
                background: "var(--amber-glow)",
                border: "1px solid rgba(245,166,35,0.35)",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--mono)",
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--amber)",
                cursor: "pointer",
              }}
            >
              {initials}
            </div>

            {showProfile && (
              <div
                style={{
                  position: "absolute",
                  top: 40,
                  right: 0,
                  zIndex: 100,
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-lit)",
                  borderRadius: "var(--radius-xl)",
                  padding: "20px",
                  width: 220,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    { label: "Registered name", value: user?.name },
                    { label: "Your vehicle", value: user?.vehicleName },
                    {
                      label: "Plate number",
                      value: user?.vehicleNumber,
                      mono: true,
                    },
                    {
                      label: "Unread messages",
                      value: unreadCount > 0 ? `${unreadCount} new` : "None",
                      amber: unreadCount > 0,
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="info-tile-label">{item.label}</p>
                      <p
                        className="info-tile-value"
                        style={{
                          fontFamily: item.mono ? "var(--mono)" : undefined,
                          letterSpacing: item.mono ? "0.08em" : undefined,
                          color: item.amber ? "var(--amber)" : undefined,
                        }}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        <p className="dash-greeting fade-up">
          Hello, {user?.name?.split(" ")[0]}
        </p>
        <h1 className="dash-title fade-up d1">
          Find any <span>vehicle</span>
          <br />
          owner instantly.
        </h1>
        {/* Arrow */}
        <div
          className="fade-up d1"
          style={{ marginBottom: -12, marginLeft: 8 }}
        >
          <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
            <path
              d="M8 6 C6 28 18 44 38 56"
              stroke="var(--amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="120"
              strokeDashoffset="120"
              style={{ animation: "drawArrow 0.8s ease 0.3s forwards" }}
            />
            <path
              d="M30 52 L38 56 L36 46"
              stroke="var(--amber)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                animation: "drawArrow 0.4s ease 1s forwards",
                strokeDasharray: 30,
                strokeDashoffset: 30,
              }}
            />
          </svg>
        </div>

        {/* Search */}
        <div className="fade-up d2">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Enter vehicle number…"
              value={vehicleNumber}
              onChange={(e) => {
                setVehicleNumber(e.target.value.toUpperCase());
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && searchVehicle()}
              autoFocus
            />
            <button
              className="btn btn-primary"
              onClick={searchVehicle}
              disabled={searching}
              style={{ padding: "13px 22px", fontSize: "0.9rem" }}
            >
              {searching ? (
                <>
                  <span className="spinner" /> Searching…
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
          {error && <div className="err-msg">{error}</div>}
        </div>

        {/* ── Hero: animation + chat ── */}
        {/* ── Hero: animation + chat ── */}
        <div
          className="fade-up d3"
          style={{
            marginTop: 40,
            display: "flex",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {/* Left: car animation */}
          <div style={{ flex: 1, minWidth: 0, height: 340 }}>
            <CarAnimation />
          </div>

          {/* Right: chat animation */}
          <div style={{ width: 210, flexShrink: 0, height: 340 }}>
            <ChatAnimation />
          </div>
        </div>
      </main>
    </div>
  );
}
