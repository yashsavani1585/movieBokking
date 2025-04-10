import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Container, Alert, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded?.unique_name;
        if (!userId) throw new Error("Invalid user information");

        const response = await axios.get(
          `https://localhost:7005/api/Tickets/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const currentDate = new Date();
        const validTickets = response.data.filter(
          (ticket) => new Date(ticket.showTime) >= currentDate
        );

        setTickets(validTickets);
      } catch (err) {
        console.error("Failed to load tickets:", err);
        setError(err.response?.data?.data || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [navigate]);

  const downloadTicket = (ticket) => {
    const content = `
🎟️ Ticket Details
────────────────────
Movie: ${ticket.movieName}
Theater: ${ticket.theaterName}
Seats: ${ticket.seatNos || "Not specified"}
Booking Time: ${new Date(ticket.bookingTime).toLocaleString()}
Status: ✅ Valid

Thank you for your booking!
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Ticket-${ticket.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <p>Loading your tickets...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (tickets.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <h2>My Tickets</h2>
        <p>You haven't booked any upcoming tickets.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Browse Movies
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">🎫 My Tickets</h2>
      <ListGroup className="mt-4">
        {tickets.map((ticket) => (
          <ListGroup.Item key={ticket.id}>
            <strong>Movie:</strong> {ticket.movieName} <br />
            <strong>Theater:</strong> {ticket.theaterName} <br />
            <strong>Seats:</strong> {ticket.seatNos || "Not specified"} <br />
            <strong>Status:</strong> ✅ {ticket.paymentStatus || "Confirmed"} <br />
            <Button
              variant="success"
              className="mt-2"
              onClick={() => downloadTicket(ticket)}
            >
              Download
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MyTickets;
