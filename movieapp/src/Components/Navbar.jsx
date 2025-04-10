import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>🎬 MovieApp</h2>
      <div style={styles.links}>
        <Link style={styles.link} to="/">Home</Link>

        {token && role === "Admin" && (
          <>
            <Link style={styles.link} to="/admin/dashboard">Dashboard</Link>
            <Link style={styles.link} to="/MovieDashboard">Add Movie</Link>
            <Link style={styles.link} to="/add-theater">Add Theater</Link>
            <Link style={styles.link} to="/add-show">Add Show</Link>
            <Link style={styles.link} to="/shows">Shows</Link>
          </>
        )}

        {token && role === "User" && (
          <Link style={styles.link} to="/my-tickets">My Tickets</Link>
        )}

        {!token ? (
          <>
            <Link style={styles.link} to="/login">Login</Link>
            <Link style={styles.link} to="/signup">Signup</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 24px",
    background: "#1c1c1c",
    color: "#fff",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logo: {
    margin: 0,
    fontWeight: "bold",
    fontSize: "20px",
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "16px",
  },
  logoutButton: {
    backgroundColor: "#e63946",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default Navbar;
