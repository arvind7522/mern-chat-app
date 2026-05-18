import React, { useEffect, useState, useRef } from "react";
import Api from "../services/api";
import socket from "../utils/socket";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .chat-root {
    height: 100vh; display: flex;
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
    color: #fff; overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 280px; flex-shrink: 0;
    display: flex; flex-direction: column;
    background: rgba(255,255,255,.02);
    border-right: 1px solid rgba(255,255,255,.07);
  }

  .sidebar-header {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  .brand-icon {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #6366f1, #ec4899);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(99,102,241,.35);
  }
  .brand-icon svg { width: 16px; height: 16px; fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; }
  .brand-name { font-size: 15px; font-weight: 700; color: rgba(255,255,255,.9); }

  .sidebar-title {
    padding: 16px 20px 8px;
    font-size: 11px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: rgba(255,255,255,.3);
    font-family: 'JetBrains Mono', monospace;
  }

  .users-list { flex: 1; overflow-y: auto; padding: 4px 10px 10px; }
  .users-list::-webkit-scrollbar { width: 4px; }
  .users-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 4px; }

  .user-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 12px; cursor: pointer;
    transition: background .15s; margin-bottom: 2px;
  }
  .user-item:hover  { background: rgba(255,255,255,.05); }
  .user-item.active { background: rgba(99,102,241,.15); }

  /* Avatar with online dot */
  .avatar-wrap { position: relative; flex-shrink: 0; }
  .avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 600; color: white;
  }
  .user-item.active .avatar { box-shadow: 0 0 0 2px #6366f1; }
  .status-dot {
    position: absolute; bottom: 1px; right: 1px;
    width: 10px; height: 10px; border-radius: 50%;
    background: #34d399; border: 2px solid #0a0a0f;
    box-shadow: 0 0 5px rgba(52,211,153,.6);
  }

  .user-info { min-width: 0; }
  .user-name  { font-size: 14px; font-weight: 500; color: rgba(255,255,255,.85); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-status { font-size: 12px; color: rgba(255,255,255,.3); margin-top: 1px; }
  .user-status.online { color: #34d399; }

  /* ── Main ── */
  .chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

  .chat-header {
    display: flex; align-items: center; gap: 12px;
    padding: 16px 24px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    background: rgba(255,255,255,.02);
  }
  .chat-header .avatar { width: 40px; height: 40px; font-size: 15px; }
  .chat-header-info h2 { font-size: 15px; font-weight: 600; color: rgba(255,255,255,.9); }
  .chat-header-info p  { font-size: 12px; margin-top: 2px; }
  .chat-header-info p.online  { color: #34d399; }
  .chat-header-info p.offline { color: rgba(255,255,255,.3); }

  .empty-state {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 12px; color: rgba(255,255,255,.2);
  }
  .empty-state svg { width: 48px; height: 48px; opacity: .3; }
  .empty-state p { font-size: 14px; }

  .messages-area {
    flex: 1; overflow-y: auto;
    padding: 20px 24px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,.08); border-radius: 4px; }

  .msg-row { display: flex; }
  .msg-row.sent     { justify-content: flex-end; }
  .msg-row.received { justify-content: flex-start; }

  .bubble {
    max-width: 65%; padding: 10px 14px;
    border-radius: 18px; font-size: 14px; line-height: 1.5;
    word-break: break-word;
  }
  .msg-row.sent .bubble {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff; border-bottom-right-radius: 4px;
    box-shadow: 0 2px 12px rgba(99,102,241,.3);
  }
  .msg-row.received .bubble {
    background: rgba(255,255,255,.07);
    border: 1px solid rgba(255,255,255,.08);
    color: rgba(255,255,255,.85); border-bottom-left-radius: 4px;
  }

  /* Typing indicator */
  .typing-bubble {
    display: flex; align-items: center; gap: 5px;
    padding: 12px 16px !important;
  }
  .typing-bubble span {
    width: 7px; height: 7px; border-radius: 50%;
    background: rgba(255,255,255,.4);
    animation: typingBounce .9s ease-in-out infinite;
  }
  .typing-bubble span:nth-child(2) { animation-delay: .15s; }
  .typing-bubble span:nth-child(3) { animation-delay: .30s; }
  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0);    opacity: .4; }
    30%           { transform: translateY(-6px); opacity: 1;  }
  }

  /* Input bar */
  .input-bar {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 24px;
    border-top: 1px solid rgba(255,255,255,.06);
    background: rgba(255,255,255,.02);
  }
  .msg-input {
    flex: 1; padding: 11px 16px;
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 12px; color: #fff; font-size: 14px;
    font-family: 'Sora', sans-serif; outline: none;
    transition: border-color .2s, background .2s, box-shadow .2s;
  }
  .msg-input::placeholder { color: rgba(255,255,255,.2); }
  .msg-input:focus {
    border-color: rgba(99,102,241,.5); background: rgba(99,102,241,.06);
    box-shadow: 0 0 0 3px rgba(99,102,241,.1);
  }
  .send-btn {
    width: 42px; height: 42px; flex-shrink: 0; border: none; border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(99,102,241,.35);
    transition: transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .2s;
  }
  .send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 6px 20px rgba(99,102,241,.5); }
  .send-btn:active:not(:disabled) { transform: scale(.96); }
  .send-btn:disabled { opacity: .4; cursor: not-allowed; }
  .send-btn svg { width: 18px; height: 18px; fill: none; stroke: white; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }

  @media (max-width: 600px) {
    .sidebar { width: 72px; }
    .sidebar-title, .user-info, .brand-name { display: none; }
    .sidebar-header { justify-content: center; padding: 16px 0; }
    .user-item { justify-content: center; padding: 10px 0; }
    .users-list { padding: 4px 6px; }
    .messages-area, .input-bar, .chat-header { padding: 12px 16px; }
  }
`;

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectdUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch users
  useEffect(() => {
    Api.get("/").then((res) => setUsers(res.data.users));
  }, []);

  // Fetch messages on user select
  useEffect(() => {
    if (!selectedUser) return;
    const token = localStorage.getItem("token");
    Api.get(`/message/${selectedUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setMessages(res.data));
  }, [selectedUser]);

  // Socket: register + online users + incoming message + typing
  useEffect(() => {
    socket.emit("addUser", loggedInUser.id);
    socket.on("connect", () => socket.emit("addUser", loggedInUser.id));

    socket.on("getOnlineUsers", (users) => setOnlineUsers(users));

    socket.on("getMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        { sender: data.senderId, message: data.message },
      ]);
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    return () => {
      socket.off("getOnlineUsers");
      socket.off("getMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!selectedUser) return;

    socket.emit("typing", { receiverId: selectedUser._id });
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 2000);
  };

  const submitHandle = async () => {
    if (!text.trim() || !selectedUser) return;
    const token = localStorage.getItem("token");

    // stop typing indicator immediately on send
    clearTimeout(typingTimeout.current);
    socket.emit("stopTyping", { receiverId: selectedUser._id });

    await Api.post(
      "/message/send",
      { receiver: selectedUser._id, message: text },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    socket.emit("sendMessage", {
      senderId: loggedInUser.id,
      receiverId: selectedUser._id,
      message: text,
    });

    setMessages((prev) => [
      ...prev,
      { senderId: loggedInUser.id, message: text },
    ]);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandle();
    }
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() ?? "?";
  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <>
      <style>{styles}</style>

      <div className="chat-root">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="brand-name">ChatApp</span>
          </div>

          <p className="sidebar-title">Contacts</p>

          <div className="users-list">
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => setSelectdUser(user)}
              >
                <div className="avatar-wrap">
                  <div className="avatar">{getInitial(user.name)}</div>
                  {isOnline(user._id) && <span className="status-dot" />}
                </div>
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p
                    className={`user-status ${isOnline(user._id) ? "online" : ""}`}
                  >
                    {isOnline(user._id) ? "Online" : user.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="chat-main">
          {!selectedUser ? (
            <div className="empty-state">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p>Select a contact to start chatting</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="chat-header">
                <div className="avatar-wrap">
                  <div
                    className="avatar"
                    style={{ width: 40, height: 40, fontSize: 15 }}
                  >
                    {getInitial(selectedUser.name)}
                  </div>
                  {isOnline(selectedUser._id) && (
                    <span className="status-dot" />
                  )}
                </div>
                <div className="chat-header-info">
                  <h2>{selectedUser.name}</h2>
                  <p
                    className={
                      isOnline(selectedUser._id) ? "online" : "offline"
                    }
                  >
                    {isOnline(selectedUser._id) ? "● Online" : "● Offline"}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-area">
                {messages.map((msg, i) => {
                  const isSent =
                    msg.senderId === loggedInUser.id ||
                    msg.sender === loggedInUser.id;
                  return (
                    <div
                      key={msg._id ?? i}
                      className={`msg-row ${isSent ? "sent" : "received"}`}
                    >
                      <div className="bubble">{msg.message}</div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="msg-row received">
                    <div className="bubble typing-bubble">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="input-bar">
                <input
                  className="msg-input"
                  type="text"
                  placeholder="Type a message… (Enter to send)"
                  value={text}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="send-btn"
                  onClick={submitHandle}
                  disabled={!text.trim()}
                >
                  <svg viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default Chat;
