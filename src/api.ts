const API_URL = "https://nexus-backend-at8n.onrender.com";

export async function getIntelligence() {
  const res = await fetch(`${API_URL}/intelligence`);
  console.log("Status code:", res.status);

  const text = await res.text();
  console.log("Raw response:", text);

  if (!res.ok) {
    throw new Error("Backend not reachable");
  }

  return JSON.parse(text);
}