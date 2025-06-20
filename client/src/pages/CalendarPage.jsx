import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App"; // Import your AuthContext

const styles = {
  body: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#f4f4f4",
    color: "#333",
    minHeight: "100vh",
    padding: "0",
  },
  header: {
    width: "100%",
    background: "#000",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
  },
  headerTitle: {
    margin: 0,
    fontSize: "36px",
    letterSpacing: "2px",
  },
  main: {
    maxWidth: "700px",
    margin: "40px auto 0 auto",
    padding: "0 20px",
  },
  calendarTable: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  th: {
    background: "#222",
    color: "#fff",
    fontWeight: "bold",
    padding: "15px 10px",
    fontSize: "16px",
  },
  td: {
    padding: "13px 10px",
    textAlign: "center",
    fontSize: "15px",
    borderBottom: "1px solid #eee",
  },
  trLast: {
    borderBottom: "none",
  },
  noBooking: {
    textAlign: "center",
    color: "#888",
    marginTop: "24px",
    fontSize: "17px",
  },
  doneBtn: {
    padding: "6px 18px",
    background: "#008000",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "13px"
  },
  status: {
    padding: "3px 12px",
    borderRadius: "7px",
    fontWeight: 600,
    fontSize: "13px",
  }
};

function formatDate(date) {
  const d = new Date(date);
  return !isNaN(d) ? d.toLocaleDateString() : "";
}

export default function CalendarPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get("/bookings")
      .then(res => setBookings(res.data))
      .catch(() => setError("Failed to load bookings."));
  }, []);

  // Mark booking as completed
  async function handleMarkDone(bookingId) {
    try {
      await api.put(`/bookings/status/${bookingId}`);
      setBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: "Completed" } : b
        )
      );
    } catch {
      setError("Failed to update booking.");
    }
  }

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Booking Calendar</h1>
      </header>
      <main style={styles.main}>
        <table style={styles.calendarTable}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Time</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Service</th>
              {user?.isAdmin && <th style={styles.th}>Contact</th>}
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Status</th>
              {user?.isAdmin && <th style={styles.th}>Action</th>}
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={user?.isAdmin ? 8 : 7} style={styles.noBooking}>No bookings yet.</td>
              </tr>
            )}
            {bookings.map((booking, idx) => (
              <tr key={booking._id} style={idx === bookings.length - 1 ? styles.trLast : {}}>
                <td style={styles.td}>{formatDate(booking.date)}</td>
                <td style={styles.td}>{booking.time || "-"}</td>
                <td style={styles.td}>{booking.name}</td>
                <td style={styles.td}>{booking.service}</td>
                {user?.isAdmin && <td style={styles.td}>{booking.contact}</td>}
                <td style={styles.td}>{booking.notes}</td>
                <td style={{
                  ...styles.td,
                  ...styles.status,
                  background: booking.status === "Completed" ? "#80cc80" : "#ffef99"
                }}>
                  {booking.status || "Pending"}
                </td>
                {user?.isAdmin && (
                  <td style={styles.td}>
                    {booking.status === "Completed" ? (
                      <span>Done</span>
                    ) : (
                      <button
                        style={styles.doneBtn}
                        onClick={() => handleMarkDone(booking._id)}
                      >
                        Mark as Done
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div style={{ color: "red", marginTop: "20px" }}>{error}</div>}
      </main>
    </div>
  );
}
