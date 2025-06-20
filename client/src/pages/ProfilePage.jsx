import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    contactNumber: "",
    address: "",
    isAdmin: false,        // <-- include isAdmin
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setProfile({
          name: data.name || "",
          contactNumber: data.contactNumber || "",
          address: data.address || "",
          isAdmin: !!data.isAdmin, // <-- get isAdmin (boolean)
        });
        setBookings(data.bookings || []);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  function handleChange(e) {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await api.put("/profile", { ...profile, email: user.email });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>My Profile</h2>

      {/* --- ADMIN badge or User label --- */}
      <div style={{ marginBottom: 18 }}>
        {profile.isAdmin ? (
          <span style={{
            color: "#fff",
            background: "#ffbf00",
            display: "inline-block",
            padding: "5px 18px",
            borderRadius: "7px",
            fontWeight: 700,
            letterSpacing: "1px"
          }}>
            ADMIN ACCOUNT
          </span>
        ) : (
          <span style={{
            color: "#fff",
            background: "#888",
            display: "inline-block",
            padding: "5px 18px",
            borderRadius: "7px",
            fontWeight: 700,
            letterSpacing: "1px"
          }}>
            USER ACCOUNT
          </span>
        )}
      </div>

      {loading ? (
        <p>Loading profile...</p>
      ) : (
        <>
          <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                required
              />
            </label>
            <label>
              Contact Number
              <input
                type="tel"
                name="contactNumber"
                value={profile.contactNumber}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                required
              />
            </label>
            <label>
              Address
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px", margin: "8px 0" }}
                rows={3}
                required
              />
            </label>
            <button type="submit" disabled={saving} style={{ padding: "10px 20px", cursor: "pointer" }}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
            {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
          </form>

          <h3>Previous Bookings</h3>
          {bookings.length === 0 ? (
            <p>No previous bookings found.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {bookings.map((b) => (
                <li key={b._id} style={{ marginBottom: 20, padding: "12px", background: "#f6f6f6", borderRadius: "8px" }}>
                  <strong>Service:</strong> {b.service || "Unknown"} <br />
                  <strong>Date:</strong> {b.date ? new Date(b.date).toLocaleDateString() : "-"} <br />
                  <strong>Time:</strong> {b.time || "-"}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
