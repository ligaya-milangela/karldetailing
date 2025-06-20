import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const interiorQuestions = [
  {
    text: "Overall interior cleanliness",
    options: [
      { label: "Tidy, just minor dust/crumbs", category: "Light" },
      { label: "Noticeable dirt, stains, or trash", category: "Moderate" },
      { label: "Heavy mud, flood debris, or mold", category: "Severe" },
    ],
  },
  {
    text: "Interior odor",
    options: [
      { label: "No foul or lingering odors", category: "Light" },
      { label: "Mild odor or musty smell", category: "Moderate" },
      { label: "Strong foul/musty odor or damp smell", category: "Severe" },
    ],
  },
  {
    text: "Seats and upholstery",
    options: [
      { label: "Clean, no visible stains", category: "Light" },
      { label: "Visible dirt, food/drink stains, or pet hair", category: "Moderate" },
      { label: "Mold, mildew, or water stains", category: "Severe" },
    ],
  },
  {
    text: "Floor, carpets, and mats",
    options: [
      { label: "Just a few crumbs, no heavy dirt", category: "Light" },
      { label: "Visible dirt, mud, or sticky residue", category: "Moderate" },
      { label: "Flooded, soaked, or moldy", category: "Severe" },
    ],
  },
  {
    text: "Dashboard, vents, and panels",
    options: [
      { label: "Mostly clean, no sticky buildup", category: "Light" },
      { label: "Dusty vents, fingerprints, smudges", category: "Moderate" },
      { label: "Sticky, moldy, or water-damaged", category: "Severe" },
    ],
  },
  {
    text: "Electrical issues (after water exposure)",
    options: [
      { label: "No issues", category: "Light" },
      { label: "Occasional issues (e.g. sticky buttons)", category: "Moderate" },
      { label: "Malfunctioning electronics/corroded metal", category: "Severe" },
    ],
  }
];

const exteriorQuestions = [
  {
    text: "Body paint condition",
    options: [
      { label: "Clean, glossy, no scratches", category: "Light" },
      { label: "Some water spots or minor scratches", category: "Moderate" },
      { label: "Dull paint, many scratches or oxidation", category: "Severe" },
    ],
  },
  {
    text: "Presence of tar, tree sap, or bird droppings",
    options: [
      { label: "None", category: "Light" },
      { label: "A few spots", category: "Moderate" },
      { label: "Widespread/tough to remove", category: "Severe" },
    ],
  },
  {
    text: "Wheel and tire condition",
    options: [
      { label: "Wheels clean, tires look fresh", category: "Light" },
      { label: "Noticeable brake dust, road grime", category: "Moderate" },
      { label: "Heavy dirt/tar build-up, hard-to-clean", category: "Severe" },
    ],
  },
  {
    text: "Exterior glass (windshield/windows)",
    options: [
      { label: "Clean, streak-free", category: "Light" },
      { label: "Water spots, bug splatters, or light haze", category: "Moderate" },
      { label: "Hard water stains, sap, heavy residue", category: "Severe" },
    ],
  },
  {
    text: "Undercarriage & fenders",
    options: [
      { label: "Clean or lightly soiled", category: "Light" },
      { label: "Some mud or road salt/dirt", category: "Moderate" },
      { label: "Heavy mud, sand, or caked dirt", category: "Severe" },
    ],
  }
];

const priceTable = {
  Light:   { interior: 400, exterior: 400 },
  Moderate:{ interior: 800, exterior: 900 },
  Severe:  { interior: 2000, exterior: 1500 },
};

const categoryDetails = {
  Light: {
    label: "🚗 Light Condition",
    description: (
      <ul>
        <li>Minor dust on dashboard and surfaces</li>
        <li>A few crumbs or small trash items</li>
        <li>Clean upholstery with no visible stains</li>
        <li>No foul or lingering odors</li>
        <li>Vents and panels mostly clean</li>
      </ul>
    ),
  },
  Moderate: {
    label: "🚙 Moderate Condition",
    description: (
      <ul>
        <li>Visible dirt on seats, carpets, or floor mats</li>
        <li>Stains from food or drinks</li>
        <li>Presence of pet hair or lint buildup</li>
        <li>Mild odor or musty smell</li>
        <li>Dust in vents, around buttons, and tight areas</li>
      </ul>
    ),
  },
  Severe: {
    label: "🌊 Severe / Flooded Condition",
    description: (
      <ul>
        <li>Heavy mud, water stains, or debris inside the car</li>
        <li>Mold or mildew present on upholstery or panels</li>
        <li>Strong foul odor or damp smell</li>
        <li>Electrical issues or corrosion from water exposure</li>
        <li>Sticky or damaged surfaces</li>
      </ul>
    ),
  },
};

const categoryOrder = ["Severe", "Moderate", "Light"];

function getMostSevere(answers, questions, section) {
  for (let cat of categoryOrder) {
    const found = questions.some((q, idx) => {
      const selectedIdx = answers[`${section}_${idx}`];
      return selectedIdx !== undefined && q.options[selectedIdx].category === cat;
    });
    if (found) return cat;
  }
  return null;
}

export default function SelfAssessPage() {
  const [answers, setAnswers] = useState({});
  const [serviceType, setServiceType] = useState("both");
  const navigate = useNavigate();

  const handleSelect = (section, qIdx, oIdx) => {
    setAnswers((prev) => ({
      ...prev,
      [`${section}_${qIdx}`]: oIdx,
    }));
  };

  const recommended = (() => {
    if (serviceType === "interior") {
      return getMostSevere(answers, interiorQuestions, "interior");
    } else if (serviceType === "exterior") {
      return getMostSevere(answers, exteriorQuestions, "exterior");
    } else {
      const intCat = getMostSevere(answers, interiorQuestions, "interior");
      const extCat = getMostSevere(answers, exteriorQuestions, "exterior");
      if (!intCat && !extCat) return null;
      return categoryOrder.find(cat => cat === intCat || cat === extCat);
    }
  })();

  let price = null;
  if (recommended) {
    if (serviceType === "both") {
      const intCat = getMostSevere(answers, interiorQuestions, "interior");
      const extCat = getMostSevere(answers, exteriorQuestions, "exterior");
      if (intCat && extCat) {
        price = priceTable[intCat].interior + priceTable[extCat].exterior;
      } else if (intCat) {
        price = priceTable[intCat].interior;
      } else if (extCat) {
        price = priceTable[extCat].exterior;
      }
    } else if (serviceType === "interior") {
      price = priceTable[recommended].interior;
    } else if (serviceType === "exterior") {
      price = priceTable[recommended].exterior;
    }
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>Assess your car:</h1>
      <div style={{ fontSize: 16, color: "#555", marginBottom: 18 }}>
        Select the most accurate description for each item:
      </div>
      {/* INTERIOR SECTION */}
      <div style={{ fontWeight: 600, margin: "22px 0 10px", fontSize: 18 }}>Interior</div>
      <form>
        {interiorQuestions.map((q, qIdx) => (
          <div key={qIdx} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 500, marginBottom: 7 }}>{q.text}</div>
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} style={{ marginRight: 18 }}>
                <input
                  type="radio"
                  name={`interior_${qIdx}`}
                  value={oIdx}
                  checked={answers[`interior_${qIdx}`] === oIdx}
                  onChange={() => handleSelect("interior", qIdx, oIdx)}
                  style={{ marginRight: 7 }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        ))}
      </form>
      {/* EXTERIOR SECTION */}
      <div style={{ fontWeight: 600, margin: "22px 0 10px", fontSize: 18 }}>Exterior</div>
      <form>
        {exteriorQuestions.map((q, qIdx) => (
          <div key={qIdx} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 500, marginBottom: 7 }}>{q.text}</div>
            {q.options.map((opt, oIdx) => (
              <label key={oIdx} style={{ marginRight: 18 }}>
                <input
                  type="radio"
                  name={`exterior_${qIdx}`}
                  value={oIdx}
                  checked={answers[`exterior_${qIdx}`] === oIdx}
                  onChange={() => handleSelect("exterior", qIdx, oIdx)}
                  style={{ marginRight: 7 }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        ))}
      </form>
      {/* SERVICE TYPE CHOICE */}
      <div style={{ marginTop: 18, marginBottom: 8 }}>
        <span style={{ fontWeight: "bold", marginRight: 8 }}>
          Select Service Type:
        </span>
        <label style={{ marginRight: 14 }}>
          <input
            type="radio"
            value="interior"
            checked={serviceType === "interior"}
            onChange={() => setServiceType("interior")}
            style={{ marginRight: 5 }}
          />
          Interior Only
        </label>
        <label style={{ marginRight: 14 }}>
          <input
            type="radio"
            value="exterior"
            checked={serviceType === "exterior"}
            onChange={() => setServiceType("exterior")}
            style={{ marginRight: 5 }}
          />
          Exterior Only
        </label>
        <label>
          <input
            type="radio"
            value="both"
            checked={serviceType === "both"}
            onChange={() => setServiceType("both")}
            style={{ marginRight: 5 }}
          />
          Both
        </label>
      </div>
      {/* RECOMMENDATION BOX */}
      <div
        style={{
          marginTop: 16,
          padding: 18,
          background: recommended ? "#e7fbe7" : "#eee",
          borderRadius: 10,
          fontSize: 18,
          fontWeight: "bold",
          color: "#006622",
        }}
      >
        {recommended ? (
          <>
            <div style={{ fontSize: 22, marginBottom: 8 }}>
              {categoryDetails[recommended].label}
            </div>
            <b>Recommended Service:</b>{" "}
            {serviceType === "both"
              ? "Full Service"
              : serviceType === "interior"
              ? "Interior Only"
              : "Exterior Only"}
            <br />
            <b>Price:</b>{" "}
            <span
              style={{
                color:
                  serviceType === "both"
                    ? "#198754"
                    : serviceType === "interior"
                    ? "#0d6efd"
                    : "#fd7e14",
              }}
            >
              ₱{price}
            </span>
            {categoryDetails[recommended].description}
            {/* --- BOOKING BUTTON --- */}
            <button
              onClick={() => navigate("/booking", {
                state: {
                  suggestedService: {
                    serviceType,
                    category: recommended,
                    price,
                  }
                }
              })}
              style={{
                marginTop: 16,
                background: "#0d6efd",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Book this Service
            </button>
          </>
        ) : (
          "— Answer all questions to see our recommendation —"
        )}
      </div>
    </div>
  );
}
