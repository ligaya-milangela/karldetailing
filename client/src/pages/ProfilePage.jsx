import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    contactNumber: "",
    address: "",
    isAdmin: false,
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
          isAdmin: !!data.isAdmin,
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #f0f0f0, #e0e0e0)",
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      padding: "40px 20px",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "700px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "30px 40px",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
      }}>
        <h2 style={{ marginBottom: 10, fontWeight: 700 }}>My Profile</h2>

        {/* Admin/User Badge */}
        <div style={{ marginBottom: 25 }}>
          {profile.isAdmin ? (
            <span style={{
              background: "#FFD700",
              color: "#000",
              padding: "6px 16px",
              fontWeight: 700,
              borderRadius: "12px",
              fontSize: "0.85rem"
            }}>
              ADMIN ACCOUNT
            </span>
          ) : (
            <span style={{
              background: "#aaa",
              color: "#fff",
              padding: "6px 16px",
              fontWeight: 600,
              borderRadius: "12px",
              fontSize: "0.85rem"
            }}>
              USER ACCOUNT
            </span>
          )}
        </div>

        {/* Profile Form */}
        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <form onSubmit={handleSubmit} style={{ marginBottom: 40 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: 6,
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "15px"
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={profile.contactNumber}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: 6,
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "15px"
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: 6,
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    fontSize: "15px",
                    resize: "none"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#000",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "0.3s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#222"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#000"}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>

              {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
              {success && <p style={{ color: "green", marginTop: 12 }}>{success}</p>}
            </form>

            {/* Booking History */}
            <h3 style={{ marginBottom: 15 }}>🧾 Previous Bookings</h3>
            {bookings.length === 0 ? (
              <p>No previous bookings found.</p>
            ) : (
              <div style={{ display: "grid", gap: "15px" }}>
                {bookings.map((b) => (
                  <div key={b._id} style={{
                    background: "#fdfdfd",
                    padding: "16px",
                    borderRadius: "12px",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    borderLeft: "6px solid #4caf50"
                  }}>
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>
                      {b.service || "Unknown"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#555", marginTop: 6 }}>
                      {b.date ? new Date(b.date).toLocaleDateString() : "-"}<br />
                      {b.time || "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
