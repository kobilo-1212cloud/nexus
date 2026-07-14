import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Health() {
  const data = [
    { day: "Mon", sleep: 7 },
    { day: "Tue", sleep: 6 },
    { day: "Wed", sleep: 8 },
    { day: "Thu", sleep: 5 },
    { day: "Fri", sleep: 7.5 },
  ];

  return (
    <div className="p-6 text-white bg-gradient-to-br from-[#0b0f1a] to-black min-h-screen">
      <h2 className="text-2xl mb-4">❤️ Health Intelligence</h2>

      <div className="bg-white/5 p-6 rounded-xl backdrop-blur-xl border border-white/10">
        <h3>Sleep Tracking</h3>

        <div className="h-64 mt-4">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <Tooltip />
              <Line type="monotone" dataKey="sleep" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}