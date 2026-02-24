import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNexus } from '@/context/NexusContext';
import { generateDailyBlueprint } from '@/services/aiService';
import { Map, Clock, Zap, Coffee, Moon, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Blueprint() {
  const { healthData, habits } = useNexus();
  const [blueprint, setBlueprint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBlueprint = async () => {
      setIsLoading(true);
      const data = await generateDailyBlueprint(healthData, habits);
      setBlueprint(data);
      setIsLoading(false);
    };
    fetchBlueprint();
  }, [healthData, habits]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'focus': return <Zap className="text-purple-400" size={20} />;
      case 'recovery': return <Coffee className="text-emerald-400" size={20} />;
      case 'health': return <Map className="text-blue-400" size={20} />;
      case 'routine': return <Moon className="text-orange-400" size={20} />;
      default: return <Clock className="text-zinc-400" size={20} />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'focus': return 'border-purple-500/30 bg-purple-500/5';
      case 'recovery': return 'border-emerald-500/30 bg-emerald-500/5';
      case 'health': return 'border-blue-500/30 bg-blue-500/5';
      case 'routine': return 'border-orange-500/30 bg-orange-500/5';
      default: return 'border-zinc-500/30 bg-zinc-500/5';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Map className="text-blue-500" />
            Daily Blueprint
          </h1>
          <p className="text-zinc-400">Your personalized adaptive schedule based on recent data.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
          <p className="text-zinc-400">Generating your optimal day...</p>
        </div>
      ) : blueprint ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Today's Focus</h3>
            <p className="text-zinc-300 leading-relaxed">{blueprint.summary}</p>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {blueprint.blocks?.map((block: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-zinc-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-xl z-10">
                  {getIconForType(block.type)}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg shadow-black/20 bg-zinc-900/80 border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{block.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 uppercase tracking-wider">{block.type}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{block.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{block.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <ShieldAlert className="mx-auto text-red-400 mb-2" size={24} />
          <p className="text-red-400">Failed to generate blueprint. Please try again.</p>
        </div>
      )}
    </div>
  );
}
