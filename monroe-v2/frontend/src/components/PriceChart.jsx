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
      <div className="card flex items-center justify-center min-h-[450px] border-dashed border-monroe-gold-muted/10">
        <p className="text-ui-label text-monroe-text-secondary opacity-40">Loading Cinematic Feed...</p>
      </div>
    );
  }

  return (
    <div className="card space-y-8 relative overflow-hidden">
      <h2 className="text-display text-xl text-monroe-gold-primary border-b border-monroe-gold-muted/10 pb-5">
        {symbol} <span className="font-light opacity-60">Feed</span>
      </h2>
      
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D6B56D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D6B56D" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#231B18" vertical={false} />
          <XAxis 
            dataKey="timestamp" 
            stroke="#8E6E33" 
            opacity={0.5} 
            tick={{fill: '#CDBB9B', fontSize: 10, fontFamily: 'sans-serif', letterSpacing: '0.1em'}} 
            tickMargin={10} 
          />
          <YAxis 
            stroke="#8E6E33" 
            opacity={0.5} 
            tick={{fill: '#CDBB9B', fontSize: 10, fontFamily: 'Georgia'}} 
            domain={['auto', 'auto']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#171314", border: "0.5px solid rgba(214,181,109,0.14)", borderRadius: "0px" }}
            labelStyle={{ color: "#F3E7D3", fontFamily: 'Georgia', marginBottom: "4px", fontSize: '12px' }}
            itemStyle={{ color: "#D6B56D", fontFamily: 'Georgia', fontSize: '14px' }}
          />
          <Area type="monotone" dataKey="close" stroke="#D6B56D" strokeWidth={1.5} fillOpacity={1} fill="url(#colorClose)" />
        </AreaChart>
      </ResponsiveContainer>

      <div className="divider"></div>

      <ResponsiveContainer width="100%" height={80}>
        <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5C1F27" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#5C1F27" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="timestamp" hide={true} />
          <YAxis hide={true} domain={['auto', 'auto']} />
          <Tooltip 
             contentStyle={{ backgroundColor: "#171314", border: "0.5px solid rgba(214,181,109,0.14)", borderRadius: "0px" }}
             labelStyle={{ color: "#F3E7D3", fontFamily: 'Georgia' }}
             itemStyle={{ color: "#5C1F27", fontFamily: 'Georgia' }}
          />
          <Area type="monotone" dataKey="volume" stroke="#5C1F27" strokeWidth={1} fillOpacity={1} fill="url(#colorVolume)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
