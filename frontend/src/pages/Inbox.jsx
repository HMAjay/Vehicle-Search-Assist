import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { getUser } from "../utils/auth";
import ConfirmModal from "../components/ConfirmModal";
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
  const [deletingId, setDeletingId] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = getUser();

  const fetchInbox = useCallback(async () => {
    try {
      const data = await api.getInbox(user._id);
      setChats(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load inbox.");
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  useEffect(() => {
    fetchInbox();
    const id = setInterval(fetchInbox, 5000);
    return () => clearInterval(id);
  }, [fetchInbox]);

  const handleDeleteConversation = async () => {
    if (!pendingDelete || deletingId) return;

    setDeletingId(pendingDelete.userId);
    try {
      await api.deleteConversation(pendingDelete.userId, user._id);
      setChats((prev) =>
        prev.filter((chat) => chat.userId !== pendingDelete.userId),
      );
      setPendingDelete(null);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete conversation.");
    } finally {
      setDeletingId("");
    }
  };

  const unreadTotal = chats.filter((c) => c.hasUnread).length;

  return (
    <div className="inbox-shell">
      {pendingDelete && (
        <ConfirmModal
          eyebrow="Delete chat"
          title={`Delete conversation with ${pendingDelete.name}?`}
          message="This will remove the conversation from your inbox only. The other person will still keep their messages."
          confirmLabel="Delete for me"
          danger
          busy={deletingId === pendingDelete.userId}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDeleteConversation}
        />
      )}

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

        {error && <div className="err-msg">{error}</div>}

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

        {!loading && chats.length === 0 && !error && (
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
          const isDeleting = deletingId === chat.userId;

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

              <button
                className="btn btn-danger convo-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setPendingDelete(chat);
                }}
                disabled={isDeleting}
                aria-label={`Delete conversation with ${chat.name}`}
                title="Delete conversation"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                </svg>
              </button>
            </div>
          );
        })}
      </main>
    </div>
  );
}
