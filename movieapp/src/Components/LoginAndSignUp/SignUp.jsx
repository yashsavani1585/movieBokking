import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    password: "",
    userType: 1,
    email: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "userType" ? parseInt(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://localhost:7005/api/User/register",
        formData
      );
      console.log("Registered:", res.data);
      setMessage("User registered successfully ✅");

      // ✅ Navigate to Login after a delay or immediately
      setTimeout(() => {
        navigate("/login"); // <-- your login route
      }, 1500); // optional 1.5s delay to show success message
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed ❌");
    }
  };

  return (
    <div className="signup-container" style={styles.container}>
      <h2>Sign Up</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="userName"
          placeholder="Username"
          value={formData.userName}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          style={styles.input}
        >
          <option value={0}>Admin</option>
          <option value={1}>User</option>
        </select>

        <button type="submit" style={styles.button}>Register</button>
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
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default SignUp;
