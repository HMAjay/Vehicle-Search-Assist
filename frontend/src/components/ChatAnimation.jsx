import { useState, useEffect, useCallback, useRef } from "react";

const MESSAGES = [
  { id: "b1", from: "them", text: "Hi, your car is blocking the exit.", time: "9:41 AM" },
  { id: "b2", from: "me",   text: "Sorry! Moving it right now.",        time: "9:42 AM" },
  { id: "b3", from: "them", text: "Thank you, appreciate it!",          time: "9:42 AM" },
  { id: "b4", from: "me",   text: "No problem at all :)",               time: "9:43 AM" },
];

export default function ChatAnimation() {
  const [visible, setVisible]     = useState([]);
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
    schedule(() => setVisible(["b1"]),                              600);
    schedule(() => setShowTyping(true),                            1400);
    schedule(() => { setShowTyping(false); setVisible(v => [...v, "b2"]); }, 2600);
    schedule(() => setVisible(v => [...v, "b3"]),                  3600);
    schedule(() => setShowTyping(true),                            4500);
    schedule(() => { setShowTyping(false); setVisible(v => [...v, "b4"]); }, 5600);
    schedule(runLoop,                                              8200);
  }, []);

  useEffect(() => {
    runLoop();
    return () => timersRef.current.forEach(clearTimeout);
  }, [runLoop]);

  return (
    <div className="chat-anim-wrap">
      {/* Header */}
      <div className="chat-anim-header">
        <div className="chat-anim-avatar">RS</div>
        <div>
          <p className="chat-anim-name">Rahul Sharma</p>
          <p className="chat-anim-status">
            <span className="chat-anim-online-dot" />
            online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-anim-messages">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`chat-anim-bubble-wrap ${msg.from}`}
            style={{
              opacity:   visible.includes(msg.id) ? 1 : 0,
              transform: visible.includes(msg.id) ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}
          >
            <div className={`chat-anim-bubble ${msg.from}`}>
              <p className="chat-anim-text">{msg.text}</p>
              <p className="chat-anim-time">{msg.time}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <div
          className="chat-anim-typing"
          style={{
            opacity:    showTyping ? 1 : 0,
            transform:  showTyping ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          }}
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="chat-anim-dot"
              style={{ animationDelay: showTyping ? `${delay}s` : undefined,
                       animationName:  showTyping ? "dotBounce" : "none" }}
            />
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="chat-anim-inputbar">
        <span className="chat-anim-placeholder">Type a message…</span>
        <div className="chat-anim-send-btn">
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M1 5h8M6 2l3 3-3 3" stroke="#0d0d0d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}