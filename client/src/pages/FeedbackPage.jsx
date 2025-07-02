import React, { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";

function FeedbackPage() {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const { data } = await api.get("/feedback");
    setFeedbacks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!rating || !comment) {
      setError("All fields required");
      return;
    }
    if (comment.length > 200) {
      setError("Max 200 characters");
      return;
    }
    try {
      await api.post("/feedback", { rating, comment });
      setSuccess("Thank you for your feedback!");
      setComment("");
      fetchFeedbacks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedbacks();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: "#f2f2f2",
      minHeight: "100vh",
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        maxWidth: "600px",
        width: "100%",
        background: "#fff",
        padding: "30px 25px",
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "25px",
          fontWeight: "700",
          fontSize: "1.8rem"
        }}>Feedback</h2>

        {user && (
          <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: "600" }}>Rating:</label>
              <select
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                style={{
                  marginLeft: 10,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "15px"
                }}
              >
                {[1, 2, 3, 4, 5].map(n =>
                  <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>
                )}
              </select>
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ fontWeight: "600" }}>Feedback:</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={200}
                rows={4}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  resize: "none",
                  fontSize: "14px",
                  marginTop: 6
                }}
              />
              <div style={{ fontSize: "12px", textAlign: "right", color: "#777" }}>
                {comment.length}/200
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "600",
                fontSize: "15px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.3s ease"
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#222"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#000"}
            >
              Submit Feedback
            </button>

            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
            {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
          </form>
        )}

        <h3 style={{ marginTop: 30, marginBottom: 15 }}>All Feedback</h3>
        {feedbacks.length === 0 ? (
          <div style={{ textAlign: "center", color: "#777" }}>No feedback yet.</div>
        ) : (
          feedbacks.map(f => (
            <div key={f._id} style={{
              background: "#f9f9f9",
              borderRadius: "15px",
              padding: "15px 20px",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{f.name || "Anonymous"}</strong>
                <span style={{ color: "#FFD700" }}>{'⭐'.repeat(f.rating)}</span>
              </div>
              <div style={{ marginTop: "8px", fontSize: "15px" }}>{f.comment}</div>
              <div style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "8px"
              }}>{(new Date(f.createdAt)).toLocaleString()}</div>

              {user?.isAdmin && (
                <button
                  onClick={() => handleDelete(f._id)}
                  style={{
                    marginTop: 10,
                    background: "crimson",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    cursor: "pointer",
                    float: "right"
                  }}>
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackPage;
