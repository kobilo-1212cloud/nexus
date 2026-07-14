import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, DollarSign, Brain, Zap } from "lucide-react";

const data = [
  { day: "Mon", sleep: 6 },
  { day: "Tue", sleep: 7 },
  { day: "Wed", sleep: 5 },
  { day: "Thu", sleep: 8 },
  { day: "Fri", sleep: 7.5 },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back, Ivy 👋</h1>
        <span className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm animate-pulse">
          AI Active
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-900/40 to-zinc-900 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400">
            <Zap /> Productivity
          </div>
          <p className="text-2xl font-bold mt-2">85%</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-zinc-900 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-400">
            <Brain /> Focus
          </div>
          <p className="text-2xl font-bold mt-2">6.5h</p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-900/40 to-zinc-900 border border-green-500/20">
          <div className="flex items-center gap-2 text-green-400">
            <Activity /> Habits
          </div>
          <p className="text-2xl font-bold mt-2">85%</p>
        </div>
      </div>

      {/* Health Chart */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 to-zinc-900 border border-purple-500/20">
        <h2 className="text-lg font-semibold mb-4">Sleep Analytics</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" stroke="#a855f7" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Finance */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900/30 to-zinc-900 border border-emerald-500/20">
        <div className="flex items-center gap-2 text-emerald-400 mb-2">
          <DollarSign /> Finance Overview
        </div>
        <p>Total Spent: <span className="font-bold">KES 8,500</span></p>
        <p>Remaining: <span className="font-bold text-green-400">KES 14,500</span></p>
      </div>
    </div>
  );
}
