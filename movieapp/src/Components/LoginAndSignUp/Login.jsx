import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://localhost:7005/api/User/login",
        credentials
      );

      const token = res.data?.token;
      const role = res.data?.role || "";

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setMessage("Login successful ✅");

        // Role-based redirect
        if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (role === "User") {
          navigate("/"); // Or navigate("/my-tickets") if you want
        } else {
          setMessage("Unknown role ❌");
        }
      } else {
        setMessage("Token not received ❌");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={credentials.userName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    background: "#f7f7f7",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Login;
