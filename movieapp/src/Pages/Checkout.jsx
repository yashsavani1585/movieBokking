

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51Q4iBQHHjsLKbPbrqs0hK3WbkVwt0Svu2LDnAKTsrRhitRzzSq9cV2NRsq4NgfBCmI2QSZWsgicYKJZYVQEkUlKf00mBvgCGnC");

const Checkout = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to continue");
      return;
    }

    axios
      .get(`https://localhost:7005/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTicket(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ticket fetch error:", err);
        setLoading(false);
      });
  }, [ticketId]);

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `https://localhost:7005/api/payments/create-checkout-session/${ticketId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { sessionId } = res.data;
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error creating Stripe session.");
    }
  };

  if (loading) return <p>Loading ticket info...</p>;
  if (!ticket) return <p>Ticket not found or unauthorized.</p>;

  return (
    <div className="container text-center mt-5">
      <h2>{ticket.movieName} - {ticket.theaterName}</h2>
      <p>Showtime: {new Date(ticket.showTime).toLocaleString()}</p>
      <p>Tickets: {ticket.noOfTickets}</p>
      <p><strong>Total Price: ₹{ticket.totalPrice}</strong></p>
      <button className="btn btn-success mt-4" onClick={handleCheckout}>
        Pay ₹{ticket.totalPrice} with Stripe
      </button>
    </div>
  );
};

export default Checkout;
