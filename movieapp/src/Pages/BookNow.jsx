

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const generateSeats = () => {
  const rows = "ABCDEFGHIJ";
  const seatsPerRow = 10;
  const seatData = [];

  for (let i = 0; i < rows.length; i++) {
    for (let j = 1; j <= seatsPerRow; j++) {
      seatData.push({
        seat: `${rows[i]}${j}`,
        price: rows[i] === "A" || rows[i] === "B" ? 200 : 150,
        row: rows[i],
      });
    }
  }

  return seatData;
};

const BookNow = () => {
  const [formData, setFormData] = useState({ showId: "", noOfTickets: "" });
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [shows, setShows] = useState([]);
  const [allSeats, setAllSeats] = useState(generateSeats());
  const [bookedSeats, setBookedSeats] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("https://localhost:7005/api/Show", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setShows(res.data))
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to load shows.");
      });
  }, [token]);

  useEffect(() => {
    if (!formData.showId || !token) return;

    axios
      .get(`https://localhost:7005/api/Tickets/booked/${formData.showId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookedSeats(res.data.seatNos || []))
      .catch((err) => {
        console.error("Error fetching booked seats", err);
        setBookedSeats([]);
      });
  }, [formData.showId]);

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      if (selectedSeats.length >= 6) {
        setErrorMsg("You can select a maximum of 6 seats.");
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "noOfTickets" && parseInt(value) > 6) {
      setErrorMsg("Maximum 6 tickets allowed.");
      return;
    } else {
      setErrorMsg("");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "noOfTickets") {
      setSelectedSeats([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !formData.showId || !formData.noOfTickets || selectedSeats.length === 0) {
      setErrorMsg("Please fill all fields and select seats.");
      return;
    }

    if (selectedSeats.length !== parseInt(formData.noOfTickets)) {
      setErrorMsg("Number of selected seats must match ticket count.");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded?.unique_name;

    try {
      const response = await axios.post(
        "https://localhost:7005/api/Tickets/book",
        {
          showId: formData.showId,
          noOfTickets: selectedSeats.length,
          seatNos: selectedSeats.join(","),
          userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ticketId = response.data.ticketId; // assuming backend returns ticketId
      setSuccessMsg("🎉 Ticket booked successfully!");
      setErrorMsg("");

      setTimeout(() => {
        navigate(`/checkout/${ticketId}`);
      }, 1500);
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg("Booking failed. Try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="container mt-5">
      <h2>🎟️ Book Your Seat</h2>
      {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Show</label>
          <select
            name="showId"
            className="form-control"
            value={formData.showId}
            onChange={handleChange}
            required
          >
            <option value="">Select Show</option>
            {shows.map((s) => (
              <option key={s.id} value={s.id}>
                {s.movieName} - {new Date(s.showTime).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>No. of Tickets</label>
          <input
            type="number"
            name="noOfTickets"
            value={formData.noOfTickets}
            onChange={handleChange}
            className="form-control"
            min={1}
            max={6}
            required
          />
        </div>

        <div className="mb-3">
          <label>Selected Seats</label>
          <input
            type="text"
            value={selectedSeats.join(", ")}
            className="form-control"
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">Confirm Booking</button>
      </form>

      <div className="mt-5">
        <h4>🪑 Seat Layout</h4>
        <div
          className="d-flex flex-wrap"
          style={{ maxWidth: "100%", gap: 4, padding: 10, justifyContent: "center" }}
        >
          {allSeats.map((seat) => {
            const isBooked = bookedSeats.includes(seat.seat);
            const isSelected = selectedSeats.includes(seat.seat);
            const bgColor = isBooked ? "red" : isSelected ? "green" : "#ccc";

            return (
              <div
                key={seat.seat}
                onClick={() => handleSeatClick(seat.seat)}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: bgColor,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  fontSize: 12,
                  cursor: isBooked ? "not-allowed" : "pointer",
                  userSelect: "none",
                }}
                title={`Rs. ${seat.price}`}
              >
                {seat.seat}
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-muted">
          <span style={{ color: "red" }}>🔴</span> Booked &nbsp;
          <span style={{ color: "green" }}>🟢</span> Selected &nbsp;
          <span style={{ color: "#ccc" }}>⚪</span> Available
        </div>
      </div>
    </div>
  );
};

export default BookNow;