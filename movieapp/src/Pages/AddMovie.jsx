import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMovie = ({ onAdd }) => {
  const [form, setForm] = useState({
    name: "",
    releaseDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await axios.post("https://localhost:7005/api/Movie", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Call onAdd if it exists, otherwise navigate
      if (typeof onAdd === 'function') {
        onAdd();
      } else {
        navigate('/MovieDashboard'); // Adjust this to your movie dashboard route
      }
      
      setForm({ name: "", releaseDate: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to add movie. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={headerStyle}>Add Movie</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Movie Name"
        value={form.name}
        onChange={handleChange}
        required
        style={inputStyle}
        disabled={isLoading}
      />
      <input
        type="date"
        name="releaseDate"
        value={form.releaseDate}
        onChange={handleChange}
        required
        style={inputStyle}
        disabled={isLoading}
      />
      <button 
        type="submit" 
        style={btnStyle}
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Movie"}
      </button>
    </form>
  );
};

// Styles
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  padding: "1.5rem",
  border: "1px solid #ddd",
  borderRadius: "8px",
  margin: "2rem auto",
  maxWidth: "400px",
  backgroundColor: "#f9f9f9"
};

const headerStyle = {
  margin: "0 0 1rem 0",
  color: "#333"
};

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

const btnStyle = {
  padding: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  transition: "background-color 0.2s",
};

const errorStyle = {
  color: "#d32f2f",
  backgroundColor: "#fde8e8",
  padding: "10px",
  borderRadius: "5px",
  marginBottom: "10px"
};

export default AddMovie;