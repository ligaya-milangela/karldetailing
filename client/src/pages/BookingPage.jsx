import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../App";
import { useLocation } from "react-router-dom";

const styles = {
  body: {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    background: "#f6f6f6",
    borderRadius: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    padding: "40px 30px",
    minWidth: "350px",
    textAlign: "center",
  },
  title: {
    margin: 0,
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#000",
    letterSpacing: "2px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "13px",
    margin: "12px 0",
    border: "1px solid #ccc",
    borderRadius: "9px",
    fontSize: "16px",
    fontFamily: "'Poppins', sans-serif",
    outline: "none",
  },
  button: {
    width: "100%",
    background: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    padding: "14px",
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "1px",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginTop: "10px",
    fontWeight: "bold",
  }
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
  // If suggestion exists, only return the matched one.
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
  // Otherwise return all possible combinations.
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

  // Autofill from profile using email as query param
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

  // Handle suggestion (from self-assess)
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
      // Reset form but preserve autofilled data
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

  // Dropdown options
  const serviceOptions = getDropdownOptions(suggestion);

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
            disabled={!!suggestion} // Disable when suggested to prevent changing
          >
            <option value="">Select Service Category</option>
            {serviceOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Show price if exists */}
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
          <button style={styles.button} type="submit">Submit Booking</button>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
        </form>
      </div>
    </div>
  );
}
