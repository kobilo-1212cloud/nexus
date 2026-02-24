import { useState, FormEvent, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNexus, HealthMetric } from '@/context/NexusContext';
import { 
  Heart, 
  Moon, 
  Footprints, 
  Plus, 
  TrendingUp, 
  Calendar,
  Activity,
  Filter
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';
import { subDays, isAfter, parseISO, format } from 'date-fns';

export default function Health() {
  const { healthData, updateHealth } = useNexus();
  const [isLogging, setIsLogging] = useState(false);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [formData, setFormData] = useState({
    sleepHours: 7,
    steps: 10000,
    heartRateAvg: 70,
    mood: 7
  });

  const filteredData = useMemo(() => {
    if (timeframe === 'all') return healthData;
    
    const days = timeframe === '7d' ? 7 : 30;
    const cutoff = subDays(new Date(), days);
    
    return healthData.filter(item => isAfter(parseISO(item.date), cutoff));
  }, [healthData, timeframe]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newEntry: HealthMetric = {
      date: format(new Date(), 'yyyy-MM-dd'),
      ...formData
    };
    updateHealth(newEntry);
    setIsLogging(false);
  };

  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), 'MMM d');
    } catch (e) {
      return tickItem;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Health & Vitals</h1>
          <p className="text-zinc-400">Monitor your biological performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-white/10">
            {(['7d', '30d', 'all'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  timeframe === t 
                    ? "bg-zinc-800 text-white shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {t === 'all' ? 'All Time' : t.toUpperCase()}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsLogging(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <Plus size={16} />
            Log Vitals
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Daily Steps</span>
            <Footprints className="text-emerald-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {healthData[healthData.length - 1].steps.toLocaleString()}
          </div>
          <p className="text-xs text-zinc-500 mt-2">Goal: 10,000 steps</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Sleep Duration</span>
            <Moon className="text-purple-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {healthData[healthData.length - 1].sleepHours}h
          </div>
          <p className="text-xs text-zinc-500 mt-2">Goal: 8 hours</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-sm font-medium">Avg Heart Rate</span>
            <Heart className="text-red-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">
            {healthData[healthData.length - 1].heartRateAvg} <span className="text-sm font-normal text-zinc-500">BPM</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">Resting: 65 BPM</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="text-emerald-500" size={18} />
            Step Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={formatXAxis}
                />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelFormatter={formatXAxis}
                />
                <Area type="monotone" dataKey="steps" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorSteps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Heart className="text-red-500" size={18} />
            Heart Rate Stability
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={formatXAxis}
                />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelFormatter={formatXAxis}
                />
                <Line type="monotone" dataKey="heartRateAvg" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {isLogging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl"
          >
            <h2 className="text-xl font-bold text-white mb-4">Log Daily Vitals</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Sleep (Hours)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.sleepHours}
                  onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Steps</label>
                <input
                  type="number"
                  value={formData.steps}
                  onChange={(e) => setFormData({ ...formData, steps: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Avg Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={formData.heartRateAvg}
                  onChange={(e) => setFormData({ ...formData, heartRateAvg: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsLogging(false)}
                  className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-zinc-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
