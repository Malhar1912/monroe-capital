import { useEffect, useState, useRef } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PriceChart({ symbol, priceHistory, recentData }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (priceHistory && priceHistory.length > 0) {
      const data = priceHistory.map(item => ({
        timestamp: new Date(item.timestamp).toLocaleTimeString(),
        close: item.close,
        high: item.high,
        low: item.low,
        volume: item.volume,
      }));
      setChartData(data);
    }
  }, [priceHistory]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="card">
        <p className="text-slate-400">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-slate-100">{symbol} - Price Chart</h2>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="timestamp" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Area type="monotone" dataKey="close" stroke="#10b981" fillOpacity={1} fill="url(#colorClose)" />
        </AreaChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="timestamp" stroke="#94a3b8" height={30} />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Area type="monotone" dataKey="volume" stroke="#8b5cf6" fillOpacity={0.6} fill="#8b5cf6" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
