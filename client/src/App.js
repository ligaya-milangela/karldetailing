import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import SelfAssessPage from "./pages/SelfAssessPage";
import FeedbackPage from "./pages/FeedbackPage"; // <-- NEW: Import FeedbackPage
import api from "./api";

// Context to manage user authentication globally
export const AuthContext = createContext();

function NavBar({ user, onLogout }) {
  return (
    <nav style={{ background: "#111", padding: "16px", marginBottom: "28px" }}>
      <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/">
        Home
      </Link>
      <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/self-assess">
        Self-Assessment
      </Link>
      <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/feedback">
        Feedback
      </Link>
      {!user && (
        <>
          <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/login">
            Login
          </Link>
          <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/register">
            Register
          </Link>
        </>
      )}
      {user && (
        <>
          <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/booking">
            Book Service
          </Link>
          <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/calendar">
            Calendar
          </Link>
          <Link style={{ color: "#fff", marginRight: "18px", textDecoration: "none" }} to="/profile">
            My Profile
          </Link>
          {/* --- ADMIN LINK REMOVED --- */}
          <span style={{ color: "#fff", marginLeft: "30px" }}>Welcome, {user.email}!</span>
          <button
            style={{
              marginLeft: "24px",
              padding: "5px 12px",
              borderRadius: "5px",
              border: "none",
              background: "#fff",
              color: "#111",
              cursor: "pointer",
            }}
            onClick={onLogout}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // Persistent login: fetch profile from backend if cookie exists
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await api.get("/auth/profile"); // returns { email, isAdmin, ... }
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    }
    fetchProfile();
  }, []);

  // Logout handler
  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <NavBar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/self-assess" element={<SelfAssessPage />} />
          <Route path="/feedback" element={<FeedbackPage />} /> {/* NEW: Feedback page route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={user ? <BookingPage /> : <LoginPage />} />
          <Route path="/calendar" element={user ? <CalendarPage /> : <LoginPage />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <LoginPage />} />
          {/* ADMIN ROUTE (admin only) */}
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <LoginPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
