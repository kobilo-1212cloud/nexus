import { useEffect, useState } from "react";
import { getIntelligence } from "./api";

function App() {
  const [status, setStatus] = useState("Connecting to Nexus Intelligence Engine...");

  useEffect(() => {
    getIntelligence()
      .then((data) => {
        setStatus(`${data.message} (${data.status})`);
      })
      .catch(() => {
        setStatus("Cannot connect to Nexus Intelligence Engine");
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Nexus Dashboard</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;