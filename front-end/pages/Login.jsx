import { useState } from "react";
import Api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // hanndleChange
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (user.email && user.password) {
      const newUser = {
        email: user.email,
        password: user.password,
      };
      const response = await Api.post("/auth/login", newUser);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/chat");

      setUser({ email: "", password: "" });
    }
  };

  return (
    <div>
      <h2>Login Page</h2>

      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          name="email"
          type="email"
          placeholder="enter you email"
          value={user.email}
          onChange={handleChange}
          required
        ></input>
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          placeholder="enter you password"
          value={user.password}
          onChange={handleChange}
          required
        ></input>
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
