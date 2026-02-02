import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // 🔐 Check login
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("Please login first");
      navigate("/");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // 🔴 Fetch unread message count
  useEffect(() => {
    if (!user?._id) return;

    const fetchUnreadCount = () => {
      fetch(`http://localhost:3000/messages/inbox/${user._id}`)
        .then(res => res.json())
        .then(data => {
          const count = data.filter(chat => chat.hasUnread).length;
          setUnreadCount(count);
        })
        .catch(err => console.error(err));
    };

    fetchUnreadCount(); // initial load
    const interval = setInterval(fetchUnreadCount, 5000);

    return () => clearInterval(interval);
  }, [user?._id]);

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔍 Search Vehicle
  const searchVehicle = async () => {
    if (!vehicleNumber.trim()) {
      alert("Enter vehicle number");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/vehicles/${vehicleNumber}`);

      if (!res.ok) {
        alert("Vehicle not found");
        return;
      }

      const data = await res.json();
      localStorage.setItem("vehicleData", JSON.stringify(data));
      navigate("/view");
    } catch {
      alert("Server error");
    }
  };

  if (!user) return null;

return (
  <div style={{
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "system-ui"
  }}>

    {/* TOP NAV */}
    <div style={{
      height: "60px",
      borderBottom: "1px solid #1f2937",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px"
    }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
        Vehicle Assist
      </h2>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={() => navigate("/inbox")}
          style={{
            position: "relative",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Inbox
          {unreadCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-10px",
              background: "#ef4444",
              borderRadius: "50%",
              fontSize: "11px",
              padding: "2px 6px"
            }}>
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          style={{
            background: "#1f2937",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            color: "#cbd5e1",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div style={{
      padding: "40px 24px",
      maxWidth: "900px",
      margin: "auto"
    }}>
      <h1 style={{
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "10px"
      }}>
        Welcome back, {user.name}
      </h1>

      <p style={{
        color: "#94a3b8",
        marginBottom: "40px"
      }}>
        Search vehicle information or contact owners instantly.
      </p>

      {/* SEARCH SECTION */}
      <div style={{
        display: "flex",
        gap: "10px",
        maxWidth: "480px"
      }}>
        <input
          placeholder="Enter Vehicle Number..."
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "8px",
            border: "1px solid #1f2937",
            background: "#111827",
            color: "white",
            outline: "none",
            fontSize: "14px"
          }}
        />

        <button
          onClick={searchVehicle}
          style={{
            padding: "12px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          Search
        </button>
      </div>
    </div>

  </div>
);
}
