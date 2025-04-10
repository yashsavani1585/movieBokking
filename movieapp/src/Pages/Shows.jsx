import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "./Show.css";

// Axios setup
const api = axios.create({
  baseURL: "https://localhost:7005",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

const Shows = () => {
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToDelete, setShowToDelete] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await api.get("/api/Show");
        setShows(response.data);
      } catch (err) {
        console.error("Failed to fetch shows:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  const formatShowTime = (iso) => format(parseISO(iso), "MMM d, yyyy h:mm a");

  const handleDelete = async () => {
    try {
      await api.delete(`/api/Show/${showToDelete.id}`);
      setShows((prev) => prev.filter((s) => s.id !== showToDelete.id));
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to delete show:", err);
    }
  };

  return (
    <div className="shows-container">
      <h1 className="shows-title">All Shows</h1>
      <div className="shows-table-wrapper">
        <table className="shows-table">
          <thead>
            <tr>
              <th>Movie</th>
              <th>Theater</th>
              <th>Time</th>
              <th>Price</th>
              <th>Tickets</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id}>
                <td>
                  <div className="movie-info">
                    <img
                      src={show.moviePosterUrl || "/images/default-movie.png"}
                      alt={show.movieName}
                      className="movie-img"
                    />
                    <span>{show.movieName}</span>
                  </div>
                </td>
                <td>{show.theaterName}</td>
                <td>{formatShowTime(show.showTime)}</td>
                <td>₹{show.price?.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      show.ticketsRemaining > 20 ? "green" : "red"
                    }`}
                  >
                    {show.ticketsRemaining}
                  </span>
                </td>
                <td>
                  <button
                    className="btn edit"
                    onClick={() => navigate(`/edit-show/${show.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => {
                      setShowToDelete(show);
                      setModalOpen(true);
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-btn" onClick={() => navigate("/add-show")}>
          <FaPlus /> Add New Show
        </button>
      </div>

      {/* Custom Delete Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Delete Confirmation</h3>
            <p>
              Are you sure you want to delete{" "}
              <strong>{showToDelete?.movieName}</strong>?
            </p>
            <div className="modal-actions">
              <button onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default Shows;
