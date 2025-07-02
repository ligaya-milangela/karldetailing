import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";
import { useLocation } from "react-router-dom";

const styles = {
  body: {
    minHeight: "100vh",
    background: "#f2f2f2",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    background: "#f4f4f4",
    borderRadius: "30px",
    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
    padding: "30px 20px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#000",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    borderRadius: "12px",
    border: "1px solid #ccc",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    border: "none",
    padding: "13px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    fontFamily: "'Poppins', sans-serif",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

const timeOptions = [
  "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

const severityLabels = {
  Severe: "🌊 Severe / Flooded Condition",
  Moderate: "🚙 Moderate Condition",
  Light: "🚗 Light Condition"
};

const serviceTypeLabels = {
  interior: "Interior Only",
  exterior: "Exterior Only",
  both: "Full Service"
};

function getDropdownOptions(suggestion) {
  if (suggestion) {
    const label =
      `${severityLabels[suggestion.category]} (${serviceTypeLabels[suggestion.serviceType]})`;
    return [
      {
        value: label,
        label: label,
        severity: suggestion.category,
        type: suggestion.serviceType
      }
    ];
  }
  const allOptions = [];
  for (const [catKey, catLabel] of Object.entries(severityLabels)) {
    for (const [typeKey, typeLabel] of Object.entries(serviceTypeLabels)) {
      allOptions.push({
        value: `${catLabel} (${typeLabel})`,
        label: `${catLabel} (${typeLabel})`,
        severity: catKey,
        type: typeKey
      });
    }
  }
  return allOptions;
}

export default function BookingPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const suggestion = location.state?.suggestedService;

  const [form, setForm] = useState({
    name: "",
    contact: "",
    date: "",
    time: "",
    service: "",
    notes: ""
  });
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hovered, setHovered] = useState(false); // For button hover effect

  useEffect(() => {
    async function fetchProfile() {
      if (!user || !user.email) return;
      try {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setForm(f => ({
          ...f,
          name: data.name || "",
          contact: data.contactNumber || ""
        }));
      } catch (err) {}
    }
    fetchProfile();
  }, [user]);

  useEffect(() => {
    if (suggestion) {
      const matchedLabel =
        `${severityLabels[suggestion.category]} (${serviceTypeLabels[suggestion.serviceType]})`;
      setForm(f => ({
        ...f,
        service: matchedLabel
      }));
      setPrice(suggestion.price ? `₱${suggestion.price}` : "");
    }
  }, [suggestion]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "service") setPrice("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/bookings", form);
      setSuccess("Booking submitted!");
      if (user && user.email) {
        const { data } = await api.get(`/profile?email=${encodeURIComponent(user.email)}`);
        setForm(f => ({
          ...f,
          name: data.name || "",
          contact: data.contactNumber || "",
          date: "",
          time: "",
          service: "",
          notes: ""
        }));
      } else {
        setForm({
          name: "",
          contact: "",
          date: "",
          time: "",
          service: "",
          notes: ""
        });
      }
      setPrice("");
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed.");
    }
  }

  const serviceOptions = getDropdownOptions(suggestion);

  const buttonStyle = {
    ...styles.button,
    backgroundColor: hovered ? "#222" : "#000",
    color: "#fff",
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Book a Service</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={form.contact}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          >
            <option value="">Select Time</option>
            {timeOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <select
            style={styles.input}
            name="service"
            value={form.service}
            onChange={handleChange}
            required
            disabled={!!suggestion}
          >
            <option value="">Select Service Category</option>
            {serviceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {price && (
            <div style={{ color: "#006622", fontWeight: 600, margin: "12px 0" }}>
              Estimated Price: {price}
            </div>
          )}
          <input
            style={styles.input}
            type="text"
            name="notes"
            placeholder="Additional Notes (optional)"
            value={form.notes}
            onChange={handleChange}
          />
          <button
            style={buttonStyle}
            type="submit"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            Submit Booking
          </button>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
        </form>
      </div>
    </div>
  );
}
