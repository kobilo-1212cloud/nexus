import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Trash2, Calendar, X, Sparkles, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNexus, Habit } from '@/context/NexusContext';
import { generateHabitSuggestions } from '@/services/aiService';

export default function Habits() {
  const { habits, addHabit, toggleHabit } = useNexus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [newCategory, setNewCategory] = useState<'Health' | 'Focus' | 'Learning' | 'Finance'>('Health');
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [userGoal, setUserGoal] = useState('Improve productivity and health');

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit,
      streak: 0,
      completed: false,
      category: newCategory,
      microGoals: []
    };
    addHabit(habit);
    setNewHabit('');
    setIsModalOpen(false);
  };

  const handleGenerateSuggestions = async () => {
    setIsSuggesting(true);
    try {
      const result = await generateHabitSuggestions(habits, userGoal);
      setSuggestions(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSuggesting(false);
    }
  };

  const acceptSuggestion = (suggestion: any) => {
    if (suggestion.isRefinement) {
      // Logic to update existing habit could go here
      // For now, we'll just add it as a new habit or update if title matches
      const existing = habits.find(h => h.title.toLowerCase() === suggestion.title.toLowerCase());
      if (existing) {
        // In a real app, we'd have an updateHabit function
        // For simplicity, we'll just add it as a new recommended habit if it's different
        addHabit({
          ...suggestion,
          id: `refined-${Date.now()}`,
          streak: existing.streak,
          completed: false,
          aiRecommended: true
        });
      } else {
        addHabit({
          ...suggestion,
          id: `ai-${Date.now()}`,
          streak: 0,
          completed: false,
          aiRecommended: true
        });
      }
    } else {
      addHabit({
        ...suggestion,
        id: `ai-${Date.now()}`,
        streak: 0,
        completed: false,
        aiRecommended: true
      });
    }
    setSuggestions(suggestions.filter(s => s.title !== suggestion.title));
  };

  return (
    <div className="space-y-6 p-6 relative">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Habit Sculptor</h1>
          <p className="text-zinc-400">Build better routines, one day at a time.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Add Habit
          </button>
        </div>
      </div>

      {/* Goal Input Section */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-4 backdrop-blur-sm">
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Optimization Goal</label>
        <div className="flex gap-3">
          <input 
            type="text"
            value={userGoal}
            onChange={(e) => setUserGoal(e.target.value)}
            placeholder="What do you want to optimize? (e.g. Better sleep, more focus)"
            className="flex-1 bg-zinc-800/50 border border-white/5 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
          <button 
            onClick={handleGenerateSuggestions}
            disabled={isSuggesting || !userGoal.trim()}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg shadow-purple-600/20"
          >
            <Sparkles size={16} />
            {isSuggesting ? 'Sculpting...' : 'AI Suggest'}
          </button>
        </div>
      </div>

      {/* AI Suggestions Area */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-4 md:grid-cols-3 mb-6"
          >
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className={cn(
                "rounded-xl border p-4 flex flex-col h-full",
                suggestion.isRefinement 
                  ? "border-blue-500/30 bg-blue-500/5" 
                  : "border-purple-500/30 bg-purple-500/5"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-purple-400 mb-1">
                      {suggestion.isRefinement ? 'Refinement' : 'New Suggestion'}
                    </span>
                    <h3 className="font-semibold text-white leading-tight">{suggestion.title}</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                    {suggestion.category}
                  </span>
                </div>
                
                {suggestion.refinementNote && (
                  <p className="text-xs text-zinc-400 italic mb-3">"{suggestion.refinementNote}"</p>
                )}

                <div className="space-y-2 mb-6 flex-1">
                  {suggestion.microGoals.map((goal: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                      <div className="h-1 w-1 rounded-full bg-purple-500" /> {goal.title}
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => acceptSuggestion(suggestion)}
                  className={cn(
                    "w-full py-2 rounded-lg text-white text-xs font-bold transition-all",
                    suggestion.isRefinement ? "bg-blue-600 hover:bg-blue-500" : "bg-purple-600 hover:bg-purple-500"
                  )}
                >
                  {suggestion.isRefinement ? 'Apply Refinement' : 'Add to Routine'}
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
              "group flex flex-col rounded-xl border p-4 transition-all",
              habit.completed 
                ? "border-blue-500/30 bg-blue-500/5" 
                : "border-white/10 bg-zinc-900/50 hover:border-white/20"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                    habit.completed
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-700 bg-transparent text-transparent hover:border-blue-500/50"
                  )}
                >
                  <Check size={16} />
                </button>
                <div>
                  <h3 className={cn(
                    "font-medium transition-colors",
                    habit.completed ? "text-zinc-400 line-through" : "text-white"
                  )}>
                    {habit.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full bg-white/5",
                      habit.category === 'Health' && "text-emerald-400",
                      habit.category === 'Focus' && "text-purple-400",
                      habit.category === 'Learning' && "text-orange-400",
                      habit.category === 'Finance' && "text-green-400",
                    )}>
                      {habit.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {habit.streak} day streak
                    </span>
                    {habit.aiRecommended && (
                      <span className="flex items-center gap-1 text-purple-400">
                        <Sparkles size={10} /> AI Pick
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Goals */}
            {habit.microGoals && habit.microGoals.length > 0 && (
              <div className="mt-3 ml-12 pl-4 border-l border-white/10 space-y-2">
                {habit.microGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2 text-sm text-zinc-400">
                    <div className={`w-1.5 h-1.5 rounded-full ${goal.completed ? 'bg-blue-500' : 'bg-zinc-700'}`} />
                    <span className={goal.completed ? 'line-through opacity-50' : ''}>{goal.title}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Add New Habit</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Habit Name</label>
                  <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g., Read 30 mins"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                  <div className="flex gap-2 flex-wrap">
                    {(['Health', 'Focus', 'Learning', 'Finance'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                          newCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddHabit}
                  className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 transition-colors mt-2"
                >
                  Create Habit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
