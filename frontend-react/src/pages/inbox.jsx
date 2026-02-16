import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  fetchInbox(); // initial load

  const interval = setInterval(fetchInbox, 5000); // refresh every 5s

  return () => clearInterval(interval); // cleanup
}, [user._id]);


const fetchInbox = () => {
  fetch(`${import.meta.env.VITE_API_URL}/messages/inbox/${user._id}`)
    .then(res => res.json())
    .then(data => setChats(data))
    .catch(err => console.error(err));
};

  return (
  <div style={{
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      width: "380px",
      height: "520px",
      background: "#0f172a",
      borderRadius: "18px",
      boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
      padding: "20px",
      display: "flex",
      flexDirection: "column"
    }}>
      <h2 style={{ color: "white", marginBottom: "15px" }}>Inbox</h2>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {chats.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No messages yet</p>
        )}

        {chats.map(chat => (
          <div
            key={chat.userId}
            onClick={() => navigate(`/chat/${chat.userId}`)}
            style={{
              background: "#1e293b",
              padding: "12px 14px",
              borderRadius: "12px",
              marginBottom: "10px",
              cursor: "pointer",
              transition: "0.2s",
              border: "1px solid transparent"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = "1px solid #3b82f6";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = "1px solid transparent";
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px"
            }}>
              <strong style={{ color: "white" }}>{chat.name}</strong>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                {new Date(chat.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>

            <p style={{
              color: "#cbd5e1",
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {chat.lastMessage}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
