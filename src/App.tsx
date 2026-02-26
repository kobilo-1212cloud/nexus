import { useEffect, useState } from "react";
import { getIntelligence } from "./api";

function App() {
  const [status, setStatus] = useState("Connecting...");
  const [online, setOnline] = useState(false);

  useEffect(() => {
    getIntelligence()
      .then((data) => {
        setStatus(`${data.message} (${data.status})`);
        setOnline(true);
      })
      .catch(() => {
        setStatus("Engine Offline");
        setOnline(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "30px" }}>
      <h1 style={{ marginBottom: "10px" }}>🚀 Nexus Dashboard</h1>

      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          backgroundColor: online ? "#e6f7ed" : "#ffe6e6",
          marginBottom: "30px",
        }}
      >
        <strong>Status:</strong> {status}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={cardStyle}>
          <h3>📊 Productivity</h3>
          <p>Track daily goals and performance metrics.</p>
        </div>

        <div style={cardStyle}>
          <h3>💰 Finance</h3>
          <p>Monitor expenses and financial analytics.</p>
        </div>

        <div style={cardStyle}>
          <h3>🤖 AI Insights</h3>
          <p>Predictive intelligence & decision support.</p>
        </div>

        <div style={cardStyle}>
          <h3>📈 Analytics</h3>
          <p>View trends and performance growth.</p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#f4f4f4",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
};

export default App;