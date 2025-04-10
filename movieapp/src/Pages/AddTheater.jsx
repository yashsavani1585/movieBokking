import React, { useState, useEffect } from "react";
import axios from "axios";

const AddTheater = () => {
  const [form, setForm] = useState({
    name: "",
    city: "",
    seatCapacity: 0,
  });

  const [theaters, setTheaters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTheaters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://localhost:7005/api/Theater", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTheaters(res.data);
    } catch (err) {
      console.error("❌ Error fetching theaters:", err);
      setError("Failed to load theaters. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "seatCapacity" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("https://localhost:7005/api/Theater", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", city: "", seatCapacity: 0 });
      await fetchTheaters();
    } catch (err) {
      console.error(err);
      setError("Failed to add theater. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;
    
    try {
      await axios.delete(`https://localhost:7005/api/Theater/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTheaters();
    } catch (err) {
      console.error(err);
      setError("Failed to delete theater. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎭 Theater Management</h1>
      
      <section style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Add New Theater</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Theater Name"
            value={form.name}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={isLoading}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
            style={styles.input}
            disabled={isLoading}
          />
          <input
            type="number"
            name="seatCapacity"
            placeholder="Seat Capacity"
            value={form.seatCapacity || ""}
            onChange={handleChange}
            min="1"
            required
            style={styles.input}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            style={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Theater"}
          </button>
        </form>
      </section>

      <section style={styles.listSection}>
        <h2 style={styles.sectionTitle}>📋 Theater List</h2>
        {error && <p style={styles.error}>{error}</p>}
        {isLoading && theaters.length === 0 ? (
          <p style={styles.loading}>Loading theaters...</p>
        ) : (
          <ul style={styles.theaterList}>
            {theaters.map((theater) => (
              <li key={theater.id} style={styles.theaterItem}>
                <div style={styles.theaterInfo}>
                  <span style={styles.theaterId}>ID: {theater.id}</span>
                  <strong style={styles.theaterName}>{theater.name}</strong>
                  <span style={styles.theaterDetails}>
                    {theater.city} • {theater.seatCapacity} seats
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(theater.id)} 
                  style={styles.deleteButton}
                  disabled={isLoading}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    color: "#333",
    marginBottom: "2rem",
  },
  formSection: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  listSection: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#444",
    marginTop: 0,
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  submitButton: {
    padding: "0.75rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#218838",
    },
  },
  theaterList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  theaterItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    marginBottom: "0.5rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateX(5px)",
    },
  },
  theaterInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  theaterId: {
    fontSize: "0.75rem",
    color: "#6c757d",
    fontFamily: "monospace",
  },
  theaterName: {
    color: "#333",
    fontSize: "1.1rem",
  },
  theaterDetails: {
    color: "#6c757d",
    fontSize: "0.9rem",
  },
  deleteButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
  error: {
    color: "#dc3545",
    backgroundColor: "#f8d7da",
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
  },
  loading: {
    color: "#6c757d",
    textAlign: "center",
    padding: "1rem",
  },
};

export default AddTheater;