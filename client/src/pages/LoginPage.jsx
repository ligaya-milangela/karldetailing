import React, { useState, useContext } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

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

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await api.post("/auth/login", form);
      setUser(res.data.user);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/booking"), 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.title}>Login to KAR DETAILING</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">
            Log In
          </button>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={{ color: "green", marginTop: "10px" }}>{success}</div>}
        </form>
      </div>
    </div>
  );
}
