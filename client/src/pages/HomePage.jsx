import React from "react";
import { Link } from "react-router-dom";

// Interior Categories
const interiorCategories = [
  {
    category: "Category 1",
    name: "Basic Interior Clean",
    details: "Includes thorough vacuuming, quick dusting, and surface wipe-down of seats, carpets, and dashboard. Ideal for routine maintenance and keeping your car tidy between deep cleans.",
  },
  {
    category: "Category 2",
    name: "Premium Interior Detailing",
    details: "Deep cleaning with shampoo, stain removal, and interior plastics restoration. All upholstery, mats, and hard-to-reach areas are cleaned for a spotless interior environment.",
  },
  {
    category: "Category 3",
    name: "Flooded Car Restoration",
    details: "Specialty service for water-damaged vehicles. Includes mildew/odor removal, drying, and full restoration of all interior surfaces. For cars exposed to flooding or excess moisture.",
  }
];

// Exterior Categories
const exteriorCategories = [
  {
    category: "Category 1",
    name: "Exterior Wash",
    details: "A careful hand wash and drying process to remove dirt, grime, and bugs from all exterior surfaces. Includes tire shine and glass cleaning.",
  },
  {
    category: "Category 2",
    name: "Paint Protection",
    details: "Application of premium wax, ceramic coating, or sealant to preserve your car's paint, prevent oxidation, and maintain a glossy finish.",
  },
  {
    category: "Category 3",
    name: "Engine Bay Cleaning",
    details: "Gentle cleaning and dressing of the engine bay to remove oil, dust, and debris. Improves both performance and appearance for under-the-hood care.",
  }
];

export default function HomePage() {
  return (
    <div style={{
      fontFamily: "'Poppins',sans-serif",
      background: "#f5f6fa",
      minHeight: "100vh",
      paddingBottom: 50
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 16px" }}>
        <h1 style={{
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 8,
          color: "#222"
        }}>
          Premium Car Detailing Services
        </h1>
        <p style={{ fontSize: 18, color: "#4b4b4b", marginBottom: 34 }}>
          Choose from our <b>three categories</b> of <span style={{color: "#1a73e8"}}>interior</span> and <span style={{color: "#fbbc05"}}>exterior</span> detailing to keep your vehicle in perfect shape.
        </p>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Link to="/self-assess" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#111",
              color: "#fff",
              fontWeight: 600,
              fontSize: 18,
              padding: "12px 36px",
              borderRadius: 7,
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
              cursor: "pointer",
              letterSpacing: "1px"
            }}>
              Book a Service
            </button>
          </Link>
        </div>

        {/* INTERIOR DETAILING */}
        <h2 style={{
          fontSize: 25,
          color: "#1a73e8",
          marginBottom: 18,
          fontWeight: 700,
          letterSpacing: 0.5
        }}>
          Interior Detailing – 3 Categories
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 26,
          marginBottom: 48,
          justifyContent: "center"
        }}>
          {interiorCategories.map((cat, i) => (
            <div key={i}
              style={{
                background: "#fff",
                borderRadius: 13,
                boxShadow: "0 1px 10px rgba(30,30,60,0.08)",
                padding: "24px 20px",
                minWidth: 265,
                maxWidth: 340,
                flex: "1 1 290px",
                borderTop: "4px solid #1a73e8"
              }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#1a73e8",
                marginBottom: 8
              }}>{cat.category}</div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                margin: 0,
                marginBottom: 7,
                color: "#1a1a1a"
              }}>{cat.name}</h3>
              <div style={{ fontSize: 15, color: "#444" }}>
                {cat.details}
              </div>
            </div>
          ))}
        </div>

        {/* EXTERIOR DETAILING */}
        <h2 style={{
          fontSize: 25,
          color: "#fbbc05",
          marginBottom: 18,
          fontWeight: 700,
          letterSpacing: 0.5
        }}>
          Exterior Detailing – 3 Categories
        </h2>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 26,
          justifyContent: "center"
        }}>
          {exteriorCategories.map((cat, i) => (
            <div key={i}
              style={{
                background: "#fff",
                borderRadius: 13,
                boxShadow: "0 1px 10px rgba(30,30,60,0.08)",
                padding: "24px 20px",
                minWidth: 265,
                maxWidth: 340,
                flex: "1 1 290px",
                borderTop: "4px solid #fbbc05"
              }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fbbc05",
                marginBottom: 8
              }}>{cat.category}</div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 600,
                margin: 0,
                marginBottom: 7,
                color: "#1a1a1a"
              }}>{cat.name}</h3>
              <div style={{ fontSize: 15, color: "#444" }}>
                {cat.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
