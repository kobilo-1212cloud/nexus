import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeJournalEntry } from '@/services/aiService';
import { useNexus } from '@/context/NexusContext';
import { BookOpen, Send, Loader2, AlertTriangle, Heart, ShieldCheck, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function Journal() {
  const { journalEntries, saveJournalEntry } = useNexus();
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [viewingEntry, setViewingEntry] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);
    const result = await analyzeJournalEntry(entry);
    setAnalysis(result);
    
    // Auto-save
    saveJournalEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: entry,
      analysis: result
    });
    
    setIsAnalyzing(false);
  };

  const startNewEntry = () => {
    setEntry('');
    setAnalysis(null);
    setViewingEntry(null);
  };

  const viewPastEntry = (pastEntry: any) => {
    setViewingEntry(pastEntry);
    setEntry(pastEntry.content);
    setAnalysis(pastEntry.analysis);
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] gap-6 p-6">
      {/* History Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4 hidden md:flex">
        <button 
          onClick={startNewEntry}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 transition-colors font-medium border border-purple-500/20"
        >
          <Plus size={18} /> New Entry
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Previous Entries</h3>
          {journalEntries.map((je) => (
            <button
              key={je.id}
              onClick={() => viewPastEntry(je)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all",
                viewingEntry?.id === je.id 
                  ? "bg-zinc-800 border-purple-500/50" 
                  : "bg-zinc-900/50 border-white/5 hover:bg-zinc-800"
              )}
            >
              <div className="text-xs text-zinc-400 mb-1 flex items-center gap-1">
                <Clock size={12} /> {format(parseISO(je.date), 'MMM d, h:mm a')}
              </div>
              <div className="text-sm text-white truncate">{je.content}</div>
              <div className="mt-2 flex items-center gap-1">
                <Heart className={cn(
                  "w-3 h-3",
                  je.analysis?.sentiment === 'positive' ? "text-emerald-400" :
                  je.analysis?.sentiment === 'negative' ? "text-orange-400" :
                  je.analysis?.sentiment === 'distressed' ? "text-red-400" :
                  "text-blue-400"
                )} />
                <span className="text-[10px] text-zinc-500 capitalize">{je.analysis?.sentiment}</span>
              </div>
            </button>
          ))}
          {journalEntries.length === 0 && (
            <p className="text-sm text-zinc-500 text-center py-4">No saved entries yet.</p>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col space-y-6 overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <BookOpen className="text-purple-500" />
              Mindful Journal
            </h1>
            <p className="text-zinc-400">Private, AI-assisted reflection space.</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>End-to-end encrypted. Analyzed locally where possible. Auto-saved to your device.</span>
          </div>
          
          <textarea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            disabled={viewingEntry !== null}
            placeholder="How are you feeling today? What's on your mind?"
            className="w-full h-48 rounded-xl border border-white/10 bg-zinc-950 p-4 text-white placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none disabled:opacity-70"
          />
          
          {!viewingEntry && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !entry.trim()}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg shadow-purple-600/20"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {isAnalyzing ? 'Analyzing...' : 'Reflect & Save'}
              </button>
            </div>
          )}
        </div>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {analysis.requiresSupport && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
                <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-red-400">Support Recommended</h4>
                  <p className="text-sm text-red-300/80 mt-1">
                    It sounds like you're going through a really tough time. Please consider reaching out to a mental health professional or a trusted friend. You don't have to handle this alone.
                  </p>
                </div>
              </div>
            )}

            <div className={cn(
              "rounded-xl border p-6",
              analysis.sentiment === 'positive' ? "border-emerald-500/30 bg-emerald-500/5" :
              analysis.sentiment === 'negative' ? "border-orange-500/30 bg-orange-500/5" :
              analysis.sentiment === 'distressed' ? "border-red-500/30 bg-red-500/5" :
              "border-blue-500/30 bg-blue-500/5"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Heart className={cn(
                  analysis.sentiment === 'positive' ? "text-emerald-400" :
                  analysis.sentiment === 'negative' ? "text-orange-400" :
                  analysis.sentiment === 'distressed' ? "text-red-400" :
                  "text-blue-400"
                )} size={20} />
                <h3 className="text-lg font-semibold text-white capitalize">{analysis.sentiment} Emotional State</h3>
              </div>
              <p className="text-zinc-300 leading-relaxed mb-6">{analysis.analysis}</p>
              
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Actionable Suggestions</h4>
              <ul className="space-y-2">
                {analysis.suggestions?.map((suggestion: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
