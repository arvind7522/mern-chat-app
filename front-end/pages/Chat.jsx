import React, { useEffect, useState } from "react";
import Api from "../services/api";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectdUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    const receiverId = selectedUser?._id;
    const response = await Api.get(`/message/${receiverId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
        setMessages(response.data);

  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await Api.get("/");
      setUsers(response.data.users);
    };
    fetchUsers();
  }, []);

  // const message = async () => {
  //   // const loggedIn = JSON.parse(localStorage.getItem("user"));
  //   const token = localStorage.getItem("token");
  //   // const senderId = loggedIn._id;
  //   const receiverId = selectedUser?._id;
  //   const response = await Api.get(`/message/${receiverId}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   setMessages(response.data);
  // };

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();
  }, [selectedUser]);

  const submitHandle = async () => {
    const token = localStorage.getItem("token");

    await Api.post(
      "/message/send",
      { receiver: selectedUser._id, message: text },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    setText("");
  };

  return (
    <>
      <div>
        {users.map((user) => {
          return (
            <div>
              <h2 key={user._id} onClick={() => setSelectdUser(user)}>
                {user.name}
              </h2>
            </div>
          );
        })}
        <h1>{selectedUser?.name}</h1>
        <h1>{selectedUser?.email}</h1>
        {messages.map((message) => {
          return (
            <div>
              <h4 key={message._id}>{message.message}</h4>
            </div>
          );
        })}
      </div>
      <div style={{ alignItems: "center" }}>
        <label htmlFor="text">Message: </label>
        <input
          type="text"
          name="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="start typing your message..."
        ></input>
        <button onClick={submitHandle}>send</button>
      </div>
    </>
  );
};

export default Chat;
