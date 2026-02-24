import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNexus } from '@/context/NexusContext';
import { analyzeFinancialHealth, analyzeFinancialAnxiety, recommendIncomeGrowth } from '@/services/aiService';
import { DollarSign, TrendingUp, AlertTriangle, ShieldCheck, HeartPulse, Briefcase, Loader2, Target } from 'lucide-react';

export default function Finance() {
  const { financeData, healthData, userProfile } = useNexus();
  const [healthScore, setHealthScore] = useState<any>(null);
  const [anxietyRisk, setAnxietyRisk] = useState<any>(null);
  const [incomeGrowth, setIncomeGrowth] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFinanceAI = async () => {
      setIsLoading(true);
      try {
        const [health, anxiety, growth] = await Promise.all([
          analyzeFinancialHealth(financeData),
          analyzeFinancialAnxiety(financeData, healthData),
          recommendIncomeGrowth(userProfile)
        ]);
        setHealthScore(health);
        setAnxietyRisk(anxiety);
        setIncomeGrowth(growth);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinanceAI();
  }, [financeData, healthData, userProfile]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <DollarSign className="text-emerald-500" />
            Financial Intelligence
          </h1>
          <p className="text-zinc-400">AI-powered health scoring, budget optimization, and income growth.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 p-3 rounded-lg border border-white/5">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Data is processed locally using federated learning. Financial details never leave your device unencrypted.</span>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
          <p className="text-zinc-400">Analyzing financial patterns...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Financial Health & Budget Optimizer */}
          {healthScore && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="text-emerald-400" size={20} /> Health Score
                </h2>
                <div className="text-3xl font-bold text-emerald-400">{healthScore.score}<span className="text-sm text-zinc-500">/100</span></div>
              </div>
              
              <div>
                <p className="text-sm text-zinc-400 mb-1">End-of-Month Stability Prediction</p>
                <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-semibold border border-blue-500/30">
                  {healthScore.stability}
                </div>
              </div>

              {healthScore.anomalies?.length > 0 && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> Anomaly Detected
                  </h4>
                  {healthScore.anomalies.map((a: any, i: number) => (
                    <p key={i} className="text-sm text-red-300">{a.alert} (${a.amount} in {a.category})</p>
                  ))}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-white mb-3">Adaptive Budget Recommendations</h4>
                <ul className="space-y-2">
                  {healthScore.recommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-zinc-500 italic">Architecture: {healthScore.architectureNote}</p>
              </div>
            </motion.div>
          )}

          <div className="space-y-6">
            {/* Financial Anxiety Detection */}
            {anxietyRisk && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <HeartPulse className="text-orange-400" size={20} /> Financial Wellness
                </h2>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-zinc-400">Anxiety Risk Level</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    anxietyRisk.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                    anxietyRisk.riskLevel === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {anxietyRisk.riskLevel}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">AI Correlation Insight:</span>
                  {anxietyRisk.correlationInsight}
                </p>

                <h4 className="text-sm font-bold text-white mb-2">Preventive Strategies</h4>
                <ul className="space-y-2">
                  {anxietyRisk.wellnessStrategies?.map((strat: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      {strat}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Income Growth Recommendations */}
            {incomeGrowth && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <Briefcase className="text-blue-400" size={20} /> Income Growth Engine
                </h2>

                <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 mb-1">
                    <Target size={16} /> Savings Target
                  </h4>
                  <p className="text-sm text-blue-200">{incomeGrowth.savingsTarget}</p>
                </div>

                <h4 className="text-sm font-bold text-white mb-3">Suggested Opportunities</h4>
                <div className="space-y-3">
                  {incomeGrowth.opportunities?.map((opp: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg border border-white/5 bg-zinc-800/50 flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-semibold text-white">{opp.title}</h5>
                        <p className="text-xs text-zinc-400">Effort: {opp.effort}</p>
                      </div>
                      <div className="text-sm font-bold text-emerald-400">{opp.potential}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
