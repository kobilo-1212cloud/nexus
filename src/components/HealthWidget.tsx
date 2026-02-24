import { useState } from 'react';
import { useNexus } from '@/context/NexusContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, Moon, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

type MetricType = 'sleep' | 'steps' | 'heartRate';

export default function HealthWidget() {
  const { healthData } = useNexus();
  const [activeMetric, setActiveMetric] = useState<MetricType>('sleep');

  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), 'MMM d');
    } catch (e) {
      return tickItem;
    }
  };

  const metricConfig = {
    sleep: {
      label: 'Sleep',
      key: 'sleepHours',
      color: '#8b5cf6',
      icon: Moon,
      unit: 'h'
    },
    steps: {
      label: 'Steps',
      key: 'steps',
      color: '#10b981',
      icon: Footprints,
      unit: ''
    },
    heartRate: {
      label: 'Heart Rate',
      key: 'heartRateAvg',
      color: '#ef4444',
      icon: Heart,
      unit: ' bpm'
    }
  };

  const current = metricConfig[activeMetric];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <current.icon className={cn(
            activeMetric === 'sleep' && "text-purple-500",
            activeMetric === 'steps' && "text-emerald-500",
            activeMetric === 'heartRate' && "text-red-500"
          )} size={20} />
          Health Intelligence
        </h3>
        <div className="flex bg-zinc-800/50 rounded-lg p-1">
          {(['sleep', 'steps', 'heartRate'] as MetricType[]).map((m) => {
            const Icon = metricConfig[m].icon;
            return (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  activeMetric === m ? "bg-zinc-700 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['sleep', 'steps', 'heartRate'] as MetricType[]).map((m) => {
          const config = metricConfig[m];
          const value = healthData[healthData.length - 1][config.key as keyof typeof healthData[0]];
          const isActive = activeMetric === m;
          
          return (
            <button 
              key={m}
              onClick={() => setActiveMetric(m)}
              className={cn(
                "p-3 rounded-lg border transition-all text-left",
                isActive 
                  ? "bg-zinc-800/80 border-white/10 ring-1 ring-white/10" 
                  : "bg-zinc-800/30 border-transparent hover:bg-zinc-800/50"
              )}
            >
              <div className="flex items-center gap-2 text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                <config.icon size={10} /> {config.label}
              </div>
              <div className="text-lg font-bold text-white">
                {typeof value === 'number' ? value.toLocaleString() : value}{config.unit}
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={healthData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={current.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#71717a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={formatXAxis}
            />
            <YAxis 
              stroke="#71717a" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={activeMetric === 'heartRate' ? ['dataMin - 5', 'dataMax + 5'] : ['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#71717a', fontSize: '10px', marginBottom: '4px' }}
              labelFormatter={formatXAxis}
            />
            <Area 
              type="monotone" 
              dataKey={current.key} 
              stroke={current.color} 
              strokeWidth={2} 
              fillOpacity={1} 
              fill="url(#colorMetric)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
