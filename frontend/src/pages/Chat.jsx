import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { getUser } from "../utils/auth";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Chat() {
  const { userId } = useParams();
  const navigate   = useNavigate();
  const me         = getUser();

  const [messages,  setMessages]  = useState([]);
  const [text,      setText]      = useState("");
  const [sending,   setSending]   = useState(false);
  const [otherName, setOtherName] = useState("…");
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.getConversation(userId, me._id);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }, [userId, me._id]);

  useEffect(() => {
    // Try to get name from vehicleData cache
    const vd = JSON.parse(localStorage.getItem("vehicleData") || "null");
    if (vd?.ownerId === userId) setOtherName(vd.ownerName);

    loadMessages();
    const id = setInterval(loadMessages, 4000);
    return () => clearInterval(id);
  }, [loadMessages, userId]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);

    // Optimistic update
    const optimistic = {
      _id:       `tmp-${Date.now()}`,
      sender:    me._id,
      receiver:  userId,
      text:      trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setText("");

    try {
      await api.sendMessage(me._id, userId, trimmed);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const initials = otherName
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="chat-shell">

      {/* Header */}
      <div className="chat-header">
        <button
          className="btn btn-ghost"
          style={{ padding: "6px 10px" }}
          onClick={() => navigate(-1)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <div className="chat-avatar">{initials || "?"}</div>

        <div>
          <p className="chat-name">{otherName}</p>
          <p className="chat-status">● online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state fade-in">
            <div className="empty-icon">💬</div>
            <p className="empty-text">Start the conversation.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender === me._id || msg.sender?._id === me._id;
          const showTime =
            i === 0 ||
            new Date(msg.createdAt) - new Date(messages[i - 1].createdAt) > 5 * 60 * 1000;

          return (
            <div key={msg._id}>
              {showTime && (
                <div style={{ textAlign: "center", margin: "12px 0" }}>
                  <span style={{
                    fontSize: "0.68rem", color: "var(--text-muted)",
                    fontFamily: "var(--mono)", background: "var(--bg-raised)",
                    padding: "3px 10px", borderRadius: 99,
                    border: "1px solid var(--border)",
                  }}>
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              )}
              <div className={`chat-bubble-wrap ${isMe ? "me" : ""}`}>
                <div className={`chat-bubble ${isMe ? "me" : "them"}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          autoFocus
        />
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={!text.trim() || sending}
        >
          {sending ? (
            <span className="spinner" style={{
              width: 14, height: 14,
              border: "2px solid rgba(13,13,13,0.3)",
              borderTopColor: "#0d0d0d",
            }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}