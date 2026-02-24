import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Bot, User, Trash2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';
import { useNexus, ChatMessage } from '@/context/NexusContext';

export default function NexusAI() {
  const { healthData, habits, financeData, chatMessages, updateChatMessages, clearChat } = useNexus();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    const newMessages = [...chatMessages, userMessage];
    updateChatMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Prepare context for the AI
      const context = {
        recentHealth: healthData.slice(-3),
        currentHabits: habits.map(h => ({ title: h.title, streak: h.streak, completed: h.completed })),
        budgets: financeData.budgets
      };

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `You are Nexus, a highly advanced personal AI assistant. You are concise, intelligent, and proactive. You help the user optimize their life, habits, and health. 
            
            Current User Context:
            ${JSON.stringify(context, null, 2)}
            
            User query: ${input}` }]
          }
        ]
      });

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm processing that data. Give me a moment."
      };

      updateChatMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the neural network. Please try again."
      };
      updateChatMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-white">
            <Sparkles className="text-blue-500" />
            Nexus AI
          </h1>
          <p className="text-zinc-400">Your personal intelligence engine. History is auto-saved.</p>
        </div>
        <button 
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
        >
          <Trash2 size={16} /> Clear Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-sm mb-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                message.role === 'user' ? "bg-blue-600" : "bg-purple-600"
              )}>
                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-2 text-sm",
                message.role === 'user' 
                  ? "bg-blue-600 text-white" 
                  : "bg-zinc-800 text-zinc-200"
              )}>
                {message.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
                <span className="animate-pulse">Thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Nexus about your day, habits, or goals..."
          className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 pr-12 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 rounded-lg bg-blue-600 p-1.5 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
