import { useEffect, useState } from 'react';
import { useNexus, Insight } from '@/context/NexusContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Brain, 
  Zap, 
  Sun, 
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  X
} from 'lucide-react';
import HealthWidget from './HealthWidget';
import FinanceWidget from './FinanceWidget';

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-500",
  purple: "bg-purple-500/10 text-purple-500",
  emerald: "bg-emerald-500/10 text-emerald-500",
  orange: "bg-orange-500/10 text-orange-500",
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
      </div>
      <div className={`rounded-full p-3 ${colorMap[color] || 'bg-zinc-500/10 text-zinc-500'}`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className="flex items-center text-xs font-medium text-emerald-500">
        <TrendingUp size={14} className="mr-1" />
        {change}
      </span>
      <span className="text-xs text-zinc-500">vs last week</span>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { insights, generateInsights, isLoadingInsights } = useNexus();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    if (insights.length === 0) {
      generateInsights();
    }
  }, []);

  const anomalies = insights.filter(i => i.type === 'anomaly' && !dismissedAlerts.includes(i.id));
  const otherInsights = insights.filter(i => i.type !== 'anomaly');

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-zinc-400">Your daily intelligence overview.</p>
        </div>
        <button 
          onClick={() => generateInsights()}
          disabled={isLoadingInsights}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors disabled:opacity-50"
        >
          <Sparkles size={16} />
          {isLoadingInsights ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      {/* Real-time Alerts Section */}
      <AnimatePresence>
        {anomalies.length > 0 && (
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="relative overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 p-4 shadow-lg shadow-red-500/5"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                <div className="flex items-start justify-between gap-4 pl-2">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-red-500/20 p-2 text-red-400 animate-pulse">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-red-400">{anomaly.title}</h4>
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                          Critical Alert
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-300 leading-relaxed">{anomaly.description}</p>
                      {anomaly.actionable && (
                        <button className="mt-3 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                          Take Action <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setDismissedAlerts(prev => [...prev, anomaly.id])}
                    className="text-zinc-500 hover:text-white transition-colors p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* AI Insights Section */}
      {otherInsights.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {otherInsights.slice(0, 3).map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl border p-4 ${
                insight.type === 'recommendation' ? 'border-blue-500/20 bg-blue-500/5' :
                'border-purple-500/20 bg-purple-500/5'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-full p-1.5 ${
                  insight.type === 'recommendation' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {insight.type === 'recommendation' ? <Lightbulb size={14} /> : <Sparkles size={14} />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Daily Briefing */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
            <Sun size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Good Morning, User.</h3>
            <p className="mt-1 text-zinc-300">
              Your focus levels are peaking earlier today. I recommend tackling your <span className="text-white font-medium">Deep Work Session</span> before 11 AM. 
              You're also on a 12-day meditation streak—keep it up to hit your monthly goal.
            </p>
            <button className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              View Full Plan <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Productivity Score" 
          value="88" 
          change="+12%" 
          icon={Zap} 
          color="blue" 
        />
        <StatCard 
          title="Focus Hours" 
          value="6.5h" 
          change="+2.1h" 
          icon={Brain} 
          color="purple" 
        />
        <StatCard 
          title="Health Index" 
          value="92" 
          change="+4%" 
          icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          title="Habit Completion" 
          value="85%" 
          change="+8%" 
          icon={TrendingUp} 
          color="orange" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HealthWidget />
        <FinanceWidget />
      </div>
    </div>
  );
}
