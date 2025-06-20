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
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <h2>Feedback</h2>
      {user && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <div>
            <label>Rating: </label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(n =>
                <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>
              )}
            </select>
          </div>
          <div>
            <label>Feedback: </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={200}
              rows={3}
              required
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: 12 }}>{comment.length}/200</div>
          </div>
          <button type="submit">Submit</button>
          {error && <div style={{ color: "red" }}>{error}</div>}
          {success && <div style={{ color: "green" }}>{success}</div>}
        </form>
      )}

      <h3>All Feedback</h3>
      {feedbacks.length === 0 ? <div>No feedback yet.</div> :
        feedbacks.map(f => (
          <div key={f._id} style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            background: "#f9f9f9"
          }}>
            <div>
              <b>{f.name || "Anonymous"}</b> - {f.rating}⭐
            </div>
            <div style={{ margin: "8px 0" }}>{f.comment}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{(new Date(f.createdAt)).toLocaleString()}</div>
            {user?.isAdmin && (
              <button
                onClick={() => handleDelete(f._id)}
                style={{
                  color: "white", background: "crimson",
                  border: "none", borderRadius: 5, padding: "4px 12px", marginTop: 6, cursor: "pointer"
                }}>
                Delete
              </button>
            )}
          </div>
        ))
      }
    </div>
  );
}

export default FeedbackPage;
