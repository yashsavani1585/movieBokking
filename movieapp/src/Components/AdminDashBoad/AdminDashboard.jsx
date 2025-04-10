import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ No token found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("https://localhost:7005/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedUsers = res.data?.data?.data || res.data || [];
      setUsers(fetchedUsers);
      setMessage("✅ Users fetched successfully");
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.message === "Network Error") {
        setMessage("❌ Network Error. Is your backend running on http://localhost:7005?");
      } else if (error.response?.status === 401) {
        setMessage("❌ Unauthorized. Invalid or expired token.");
      } else {
        setMessage("❌ Failed to fetch users. Check server logs or browser console.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      {message && <p style={styles.message}>{message}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>User Type</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.userName}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.userType}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.button}
                      onClick={() => window.alert(JSON.stringify(u, null, 2))}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={styles.td} colSpan="6">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    border: "1px solid #ccc",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    backgroundColor: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
  message: {
    marginBottom: "10px",
    fontWeight: "bold",
    color: "green",
  },
  button: {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminDashboard;
