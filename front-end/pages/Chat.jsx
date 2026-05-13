import React, { useEffect, useState } from "react";
import Api from "../services/api";

const Chat = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await Api.get("/");
      console.log("fetch users>>>>", response.data.users);
      setUsers(response.data.users);
    };
    fetchUsers();
  }, []);

  return (

    <>
    {users.map((user)=>{
      return <h2 key={user._id}>{user.name}</h2>
    })}
    </>
  )
};

export default Chat;
