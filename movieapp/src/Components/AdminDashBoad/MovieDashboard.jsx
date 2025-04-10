import React, { useEffect, useState } from "react";
import axios from "axios";

const MovieDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    name: "",
    releaseDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchMovies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("https://localhost:7005/api/Movie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(res.data);
    } catch (err) {
      console.error("❌ Error fetching movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("https://localhost:7005/api/Movie", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchMovies(); // Refresh the list
      setForm({ name: "", releaseDate: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to add movie. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎬 Movie Dashboard</h1>
      </header>

      <div style={styles.content}>
        <section style={styles.formSection}>
          <h2 style={styles.sectionTitle}>Add New Movie</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Movie Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={isLoading}
            />
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              required
              style={styles.input}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Movie"}
            </button>
          </form>
        </section>

        <section style={styles.moviesSection}>
          <h2 style={styles.sectionTitle}>📋 Movie List</h2>
          {error && <p style={styles.error}>{error}</p>}
          {isLoading && movies.length === 0 ? (
            <p style={styles.loading}>Loading movies...</p>
          ) : (
            <ul style={styles.movieList}>
              {movies.map((movie) => (
                <li key={movie.id} style={styles.movieItem}>
                  <div style={styles.movieContent}>
                    <div style={styles.movieInfo}>
                      <span style={styles.movieId}>ID: {movie.id}</span>
                      <strong style={styles.movieName}>{movie.name}</strong>
                    </div>
                    <span style={styles.movieDate}>
                      {new Date(movie.releaseDate).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
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
    marginBottom: "2rem",
    textAlign: "center",
  },
  title: {
    color: "#333",
    margin: 0,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  formSection: {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  moviesSection: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#444",
    marginTop: 0,
    marginBottom: "1rem",
    paddingBottom: "0.5rem",
    borderBottom: "1px solid #eee",
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
  button: {
    padding: "0.75rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  movieList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  movieItem: {
    padding: "1rem",
    marginBottom: "0.5rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateX(5px)",
    },
  },
  movieContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  movieInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  movieId: {
    fontSize: "0.8rem",
    color: "#666",
    fontFamily: "monospace",
  },
  movieName: {
    color: "#333",
  },
  movieDate: {
    color: "#6c757d",
    fontSize: "0.9rem",
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

export default MovieDashboard;