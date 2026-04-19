import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { getUser } from "../utils/auth";
import { getInitials } from "../utils/userDisplay";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Inbox() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUser();

  const fetchInbox = useCallback(async () => {
    try {
      const data = await api.getInbox(user._id);
      setChats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchInbox();
    const id = setInterval(fetchInbox, 5000);
    return () => clearInterval(id);
  }, [fetchInbox]);

  const unreadTotal = chats.filter((c) => c.hasUnread).length;

  return (
    <div className="inbox-shell">
      <nav className="topnav">
        <span className="topnav-brand">VahanConnect</span>
        <button
          className="btn btn-ghost"
          style={{ padding: "6px 12px" }}
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </nav>

      <main className="inbox-body">
        <h1 className="inbox-title fade-up">
          Inbox
          {unreadTotal > 0 && (
            <span
              className="badge"
              style={{ marginLeft: 10, position: "relative", top: -2 }}
            >
              {unreadTotal}
            </span>
          )}
        </h1>
        <p className="inbox-sub fade-up d1">
          {loading
            ? "Loading..."
            : chats.length === 0
              ? "No conversations yet."
              : `${chats.length} conversation${chats.length !== 1 ? "s" : ""}`}
        </p>

        {loading && (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 40 }}
          >
            <span
              className="spinner spinner-amber"
              style={{ width: 24, height: 24 }}
            />
          </div>
        )}

        {!loading && chats.length === 0 && (
          <div className="empty-state fade-up">
            <div className="empty-icon">Inbox</div>
            <p className="empty-text">
              Search for a vehicle on the dashboard
              <br />
              and start a conversation.
            </p>
          </div>
        )}

        {chats.map((chat, i) => {
          const initials = getInitials(chat.name, "VC");

          return (
            <div
              key={chat.userId}
              className={`convo-item fade-up ${chat.hasUnread ? "unread" : ""}`}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              onClick={() =>
                navigate(`/chat/${chat.userId}`, { state: { name: chat.name } })
              }
            >
              <div className="convo-avatar">{initials}</div>

              <div className="convo-info">
                <p className="convo-name">{chat.name}</p>
                <p className="convo-last">
                  {chat.lastMessage || "No messages yet"}
                </p>
              </div>

              <div className="convo-meta">
                <p className="convo-time">{formatTime(chat.time)}</p>
                {chat.hasUnread && <div className="unread-dot" />}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
