import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import Finance from "./components/Finance";
import Health from "./components/Health";
import Journal from "./components/Journal";
import NexusAI from "./components/NexusAI";
import Sidebar from "./components/Sidebar";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(true);

  const renderPage = () => {
    switch (activeTab) {
      case "finance":
        return <Finance />;
      case "health":
        return <Health />;
      case "journal":
        return <Journal />;
      case "nexus-ai":
        return <NexusAI />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex-1 ml-64 p-4">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;