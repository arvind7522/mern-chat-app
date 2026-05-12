import { useState } from "react";
import Api from "../services/api";

function Register() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (name && email && password) {
        const newUser = {
          name,
          email,
          password,
        };
        await Api.post("/auth/register", newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.log(error);
    }
    setName("");
    setEmail("");
    setPassword("");
  };
  return (
    <div>
      <h1>Register Page</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          placeholder="enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        ></input>
        <br />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input>
        <br />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input>
        <br />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
