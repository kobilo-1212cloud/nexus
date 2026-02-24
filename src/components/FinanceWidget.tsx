import { useNexus } from '@/context/NexusContext';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function FinanceWidget() {
  const { financeData } = useNexus();

  const totalSpent = financeData.budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const totalLimit = financeData.budgets.reduce((acc, curr) => acc + curr.limit, 0);
  const percentage = Math.round((totalSpent / totalLimit) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <DollarSign className="text-emerald-500" size={20} />
          Finance
        </h3>
        <span className="text-xs text-zinc-500">Monthly Budget</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-[160px] w-[160px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={financeData.budgets}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="spent"
              >
                {financeData.budgets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-white">{percentage}%</span>
            <span className="text-xs text-zinc-500">Used</span>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-zinc-400">Total Spent</p>
              <p className="text-2xl font-bold text-white">${totalSpent}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">Remaining</p>
              <p className="text-lg font-medium text-emerald-400">${totalLimit - totalSpent}</p>
            </div>
          </div>

          <div className="space-y-2">
            {financeData.budgets.slice(0, 3).map((budget, i) => (
              <div key={budget.category} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">{budget.category}</span>
                  <span className={budget.spent > budget.limit ? "text-red-400" : "text-zinc-500"}>
                    ${budget.spent} / ${budget.limit}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%`,
                      backgroundColor: COLORS[i % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
