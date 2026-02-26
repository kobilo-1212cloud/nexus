const API_URL = "https://nexus-backend-at8n.onrender.com";
export async function getIntelligence() {
  const res = await fetch(`${API_URL}/intelligence`);
  
  if (!res.ok) {
    throw new Error("Backend not reachable");
  }

  return res.json();
}