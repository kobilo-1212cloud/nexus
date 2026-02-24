import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeUserData } from '@/services/aiService';

// Types for our data model
export interface HealthMetric {
  date: string;
  sleepHours: number;
  steps: number;
  heartRateAvg: number;
  mood: number; // 1-10
}

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  merchant: string;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completed: boolean;
  category: 'Health' | 'Focus' | 'Learning' | 'Finance';
  microGoals: { id: string; title: string; completed: boolean }[];
  aiRecommended?: boolean;
}

export interface Insight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  date: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  analysis: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface UserProfile {
  skills: string[];
  timeAvailability: string; // e.g., "10 hours/week"
  financialGoals: string;
}

interface NexusContextType {
  healthData: HealthMetric[];
  financeData: {
    transactions: Transaction[];
    budgets: Budget[];
  };
  habits: Habit[];
  insights: Insight[];
  journalEntries: JournalEntry[];
  chatMessages: ChatMessage[];
  userProfile: UserProfile;
  addHabit: (habit: Habit) => void;
  toggleHabit: (id: string) => void;
  updateHealth: (data: HealthMetric) => void;
  generateInsights: () => Promise<void>;
  saveJournalEntry: (entry: JournalEntry) => void;
  updateChatMessages: (messages: ChatMessage[]) => void;
  clearChat: () => void;
  isLoadingInsights: boolean;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock Initial Data
  const [healthData, setHealthData] = useState<HealthMetric[]>([
    { date: '2026-02-17', sleepHours: 7.2, steps: 8500, heartRateAvg: 72, mood: 8 },
    { date: '2026-02-18', sleepHours: 6.5, steps: 10200, heartRateAvg: 75, mood: 7 },
    { date: '2026-02-19', sleepHours: 8.0, steps: 6000, heartRateAvg: 68, mood: 9 },
    { date: '2026-02-20', sleepHours: 5.5, steps: 4000, heartRateAvg: 80, mood: 5 },
    { date: '2026-02-21', sleepHours: 7.0, steps: 9000, heartRateAvg: 74, mood: 8 },
    { date: '2026-02-22', sleepHours: 9.0, steps: 12000, heartRateAvg: 65, mood: 10 },
    { date: '2026-02-23', sleepHours: 8.5, steps: 11000, heartRateAvg: 66, mood: 9 },
  ]);

  const [financeData, setFinanceData] = useState({
    transactions: [
      { id: '1', date: '2026-02-20', category: 'Food', amount: 45.50, merchant: 'Grocery Store' },
      { id: '2', date: '2026-02-21', category: 'Transport', amount: 12.00, merchant: 'Uber' },
      { id: '3', date: '2026-02-22', category: 'Entertainment', amount: 25.00, merchant: 'Cinema' },
      { id: '4', date: '2026-02-23', category: 'Food', amount: 85.00, merchant: 'Restaurant' }, // Potential anomaly
    ],
    budgets: [
      { category: 'Food', limit: 500, spent: 320 },
      { category: 'Transport', limit: 200, spent: 150 },
      { category: 'Entertainment', limit: 150, spent: 140 },
      { category: 'Savings', limit: 1000, spent: 200 },
    ]
  });

  const [habits, setHabits] = useState<Habit[]>([
    { 
      id: '1', 
      title: 'Morning Meditation', 
      streak: 12, 
      completed: true, 
      category: 'Health',
      microGoals: [{ id: 'm1', title: 'Sit for 5 mins', completed: true }] 
    },
    { 
      id: '2', 
      title: 'Deep Work Session', 
      streak: 5, 
      completed: false, 
      category: 'Focus',
      microGoals: [{ id: 'm2', title: 'Phone in other room', completed: false }] 
    },
  ]);

  const [insights, setInsights] = useState<Insight[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hello. I am Nexus. I've analyzed your recent data. How can I assist you today?" 
    }
  ]);
  const [userProfile] = useState<UserProfile>({
    skills: ['Programming', 'Writing', 'Data Analysis'],
    timeAvailability: '15 hours/week',
    financialGoals: 'Save $5000 for a car, pay off student loans faster.'
  });
  
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedJournal = localStorage.getItem('nexus_journal');
    const savedChat = localStorage.getItem('nexus_chat');
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    if (savedChat) setChatMessages(JSON.parse(savedChat));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('nexus_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('nexus_chat', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const addHabit = (habit: Habit) => setHabits([...habits, habit]);
  
  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed, streak: h.completed ? h.streak : h.streak + 1 } : h
    ));
  };

  const updateHealth = (data: HealthMetric) => {
    setHealthData([...healthData, data]);
  };

  const saveJournalEntry = (entry: JournalEntry) => {
    setJournalEntries([entry, ...journalEntries]);
  };

  const updateChatMessages = (messages: ChatMessage[]) => {
    setChatMessages(messages);
  };

  const clearChat = () => {
    setChatMessages([{ 
      id: Date.now().toString(), 
      role: 'assistant', 
      content: "Chat history cleared. How can I assist you today?" 
    }]);
  };

  const generateInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const newInsights = await analyzeUserData(healthData, habits, financeData.budgets);
      setInsights(newInsights);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <NexusContext.Provider value={{
      healthData,
      financeData,
      habits,
      insights,
      journalEntries,
      chatMessages,
      userProfile,
      addHabit,
      toggleHabit,
      updateHealth,
      generateInsights,
      saveJournalEntry,
      updateChatMessages,
      clearChat,
      isLoadingInsights
    }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (context === undefined) {
    throw new Error('useNexus must be used within a NexusProvider');
  }
  return context;
};
