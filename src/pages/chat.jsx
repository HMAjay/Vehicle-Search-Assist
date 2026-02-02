import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // 🔹 Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 🔹 Fetch chat messages
  useEffect(() => {
    fetch(`http://localhost:3000/messages/chat/${userId}/${loggedUser._id}`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error(err));
  }, [userId, loggedUser._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await fetch("http://localhost:3000/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: loggedUser._id,
        receiverId: userId,
        text
      })
    });

    if (res.ok) {
      setMessages(prev => [
        ...prev,
        { sender: loggedUser._id, receiver: userId, text, createdAt: new Date() }
      ]);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
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
        width: "100%",
        maxWidth: "600px",
        height: "85vh",
        background: "#0f172a",
        borderRadius: "18px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>

        {/* 🔹 HEADER */}
        <div style={{
          background: "#1e293b",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #334155"
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginRight: "10px",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            ← Back
          </button>
          <h2 style={{ color: "white", margin: 0 }}>Chat</h2>
        </div>

        {/* 💬 MESSAGES */}
        <div style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          background: "#0f172a"
        }}>
          {messages.map((msg, i) => {
            const isMe = msg.sender === loggedUser._id;
            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}>
                <div style={{
                  background: isMe ? "#2563eb" : "#334155",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%"
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* ✏️ INPUT */}
        <div style={{
          padding: "12px",
          borderTop: "1px solid #334155",
          background: "#1e293b",
          display: "flex",
          gap: "8px"
        }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              outline: "none"
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer"
            }}
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;
