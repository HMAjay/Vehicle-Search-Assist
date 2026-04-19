import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";
import { getUser } from "../utils/auth";
import { getDisplayName, getInitials, normalizeName } from "../utils/userDisplay";

function formatDateLabel(dateStr) {
  const msgDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (msgDate.toDateString() === today.toDateString()) return "Today";
  if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
  return msgDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const me = getUser();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [otherName, setOtherName] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const shouldScrollRef = useRef(true);
  const prevLengthRef = useRef(0);
  const sendingRef = useRef(false);

  const scrollToBottom = (behavior = "smooth") =>
    bottomRef.current?.scrollIntoView({ behavior });

  const resolveName = useCallback(
    (msgs) => {
      if (normalizeName(otherName)) return;

      const vd = JSON.parse(localStorage.getItem("vehicleData") || "null");
      if (vd?.ownerId === userId && vd?.ownerName) {
        setOtherName(vd.ownerName);
        return;
      }

      if (location.state?.name) {
        setOtherName(location.state.name);
        return;
      }

      const fromOther = msgs.find(
        (m) => (m.sender?._id ?? m.sender) !== me._id,
      );

      if (fromOther?.senderName) {
        setOtherName(fromOther.senderName);
        return;
      }

      if (fromOther?.sender?.name) {
        setOtherName(fromOther.sender.name);
      }
    },
    [location.state, me._id, otherName, userId],
  );

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.getConversation(userId, me._id);
      setMessages(data);
      resolveName(data);
    } catch (err) {
      console.error(err);
    }
  }, [userId, me._id, resolveName]);

  useEffect(() => {
    const vd = JSON.parse(localStorage.getItem("vehicleData") || "null");
    if (vd?.ownerId === userId && vd?.ownerName) setOtherName(vd.ownerName);
    if (location.state?.name) setOtherName(location.state.name);

    loadMessages();
  }, [loadMessages, location.state, userId]);

  useEffect(() => {
    const id = setInterval(() => {
      shouldScrollRef.current = false;
      loadMessages();
    }, 4000);
    return () => clearInterval(id);
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const isNew = messages.length > prevLengthRef.current;
    prevLengthRef.current = messages.length;
    if (shouldScrollRef.current && isNew) {
      scrollToBottom(prevLengthRef.current <= 1 ? "instant" : "smooth");
    }
    shouldScrollRef.current = false;
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sendingRef.current) return;

    sendingRef.current = true;
    setSending(true);
    shouldScrollRef.current = true;
    setText("");

    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      sender: me._id,
      receiver: userId,
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await api.sendMessage(me._id, userId, trimmed);
    } catch (err) {
      console.error(err);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const displayName = getDisplayName(otherName, "Contact");
  const initials = getInitials(otherName, "VC");

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <button
          className="btn btn-ghost chat-back-btn"
          onClick={() => navigate(-1)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="chat-avatar">{initials}</div>
        <p className="chat-name">{displayName}</p>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state fade-in">
            <div className="empty-icon">Chat</div>
            <p className="empty-text">Start the conversation.</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = (msg.sender?._id ?? msg.sender) === me._id;
          const showDate =
            i === 0 ||
            new Date(msg.createdAt).toDateString() !==
              new Date(messages[i - 1].createdAt).toDateString();

          return (
            <div key={msg._id}>
              {showDate && (
                <div className="chat-date-divider">
                  <span className="chat-date-label">
                    {formatDateLabel(msg.createdAt)}
                  </span>
                </div>
              )}
              <div className={`chat-bubble-wrap ${isMe ? "me" : ""}`}>
                <div className={`chat-bubble ${isMe ? "me" : "them"}`}>
                  <span className="chat-bubble-text">{msg.text}</span>
                  <span className="chat-bubble-time">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <input
          ref={inputRef}
          className="chat-input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          autoFocus
        />
        <button
          className="chat-send"
          onClick={sendMessage}
          disabled={!text.trim() || sending}
        >
          {sending ? (
            <span className="spinner chat-spinner" />
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
