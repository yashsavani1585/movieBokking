
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get("https://localhost:7005/api/Show");
        console.log("API Response:", response.data);
        setMovies(response.data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/book-now");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading movies...</div>;
  }

  if (movies.length === 0) {
    return <div className="text-center mt-5">No movies available right now.</div>;
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Now Showing</h2>
      <div className="row g-4">
        {movies.map((movie, index) => {
          const {
            id,
            movieName,
            moviePosterUrl,
            showTime,
            price,
            ticketsRemaining,
          } = movie;

          const imageSrc =
            moviePosterUrl?.startsWith("https://") || moviePosterUrl?.startsWith("http://")
              ? moviePosterUrl
              : "https://via.placeholder.com/400x400?text=No+Image";

          return (
            <div className="col-lg-4 col-md-6 col-sm-12" key={id || index}>
              <div className="card h-100 shadow-sm">
                <img
                  src={imageSrc}
                  alt={movieName || "Untitled Movie"}
                  className="card-img-top"
                  style={{ height: "400px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center fw-bold">
                    {movieName || "Untitled Movie"}
                  </h5>
                  <p className="text-center text-muted mb-1">
                    Show Time: {new Date(showTime).toLocaleString()}
                  </p>
                  <p className="text-center mb-2">Price: ₹{price}</p>
                  <p className="text-center text-success mb-3">
                    Tickets Remaining: {ticketsRemaining}
                  </p>
                  <button
                    className="btn btn-primary w-100 mt-auto"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
