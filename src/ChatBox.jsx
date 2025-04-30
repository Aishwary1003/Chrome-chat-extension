import React, { useState, useEffect, useRef } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [apiUrl, setApiUrl] = useState("");
  const [endpoint, setEndpoint] = useState("endpoint1");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || !apiUrl.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setInput(""); // Clear input
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text, endpoint }),
      });

      const data = await res.json();
      const botMessage = { text: data.reply, sender: "bot" };

      setMessages((prev) => [...prev, userMessage, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: "❌ Error contacting server.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="chat-container"
      style={{ maxWidth: 400, margin: "0 auto", fontFamily: "sans-serif" }}
    >
      <div className="api-url-section" style={{ marginBottom: 10 }}>
        <input
          type="text"
          className="api-input"
          placeholder="Enter API base URL (e.g. http://localhost:5000)"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
      </div>

      <div className="endpoint-selector" style={{ marginBottom: 10 }}>
        <select
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        >
          <option value="endpoint1">Endpoint 1</option>
          <option value="endpoint2">Endpoint 2</option>
        </select>
      </div>

      <div
        className="chat-window"
        ref={chatWindowRef}
        style={{
          border: "1px solid #ccc",
          height: 300,
          overflowY: "auto",
          padding: 10,
          backgroundColor: "#f9f9f9",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender}`}
            style={{
              marginBottom: 8,
              textAlign: msg.sender === "user" ? "right" : "left",
              color: msg.sender === "user" ? "#1a73e8" : "#000",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSend}
        className="chat-form"
        style={{ display: "flex", gap: 5 }}
      >
        <input
          type="text"
          className="input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
          }}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={isLoading}
          style={{
            padding: "8px 12px",
            backgroundColor: "#1a73e8",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
