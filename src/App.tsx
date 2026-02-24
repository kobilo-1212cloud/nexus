import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Habits from '@/components/Habits';
import NexusAI from '@/components/NexusAI';
import Health from '@/components/Health';
import Auth from '@/components/Auth';
import Blueprint from '@/components/Blueprint';
import Journal from '@/components/Journal';
import Finance from '@/components/Finance';
import { Menu } from 'lucide-react';
import { NexusProvider } from '@/context/NexusContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'blueprint':
        return <Blueprint />;
      case 'habits':
        return <Habits />;
      case 'finance':
        return <Finance />;
      case 'nexus-ai':
        return <NexusAI />;
      case 'health':
        return <Health />;
      case 'journal':
        return <Journal />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NexusProvider>
      <div className="flex min-h-screen bg-zinc-950 text-white">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main className="flex-1 transition-all duration-300 ease-in-out md:ml-64">
          <div className="md:hidden p-4 border-b border-white/10 flex items-center justify-between">
             <div className="flex items-center gap-2 font-bold text-lg">
                <div className="h-6 w-6 rounded bg-blue-600" />
                Nexus
             </div>
             <button onClick={() => setIsSidebarOpen(true)}>
               <Menu className="text-zinc-400" />
             </button>
          </div>
          {renderContent()}
        </main>
      </div>
    </NexusProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
