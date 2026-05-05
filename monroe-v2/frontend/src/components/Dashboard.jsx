import { useEffect, useState, useRef } from "react";
import { api } from "../api";
import SignalCard from "./SignalCard";
import PriceChart from "./PriceChart";
import ConnectionStatus from "./ConnectionStatus";
import TradeHistory from "./TradeHistory";

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "SPY", "QQQ", "TSLA"];

export default function Dashboard() {
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [trades, setTrades] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef(null);

  // Fetch historical data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/api/history/${symbol}`, {
          params: { period: "5d", interval: "1h" }
        });
        setPriceHistory(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, [symbol]);

  // Fetch trades
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await api.get("/api/trades");
        setTrades(res.data);
      } catch (err) {
        console.error("Failed to fetch trades:", err);
      }
    };
    fetchTrades();
  }, []);

  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/ws/${symbol}`;

    setLoading(true);
    setError(null);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`Connected to WebSocket for ${symbol}`);
      setConnected(true);
      setLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "price_update") {
          setData(message);
          setError(null);
        } else if (message.type === "error") {
          setError(message.message);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("Connection error");
      setConnected(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [symbol]);

  const handleSymbolChange = (newSymbol) => {
    setSymbol(newSymbol);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-100">Monroe v2</h1>
            <p className="text-slate-400">Algorithmic Trading System</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">US Equities</p>
            <p className="text-slate-300 font-mono">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Connection Status */}
        <ConnectionStatus connected={connected} error={error} wsStatus={loading ? "Connecting..." : "Ready"} />

        {/* Symbol Selector */}
        <div className="card">
          <p className="text-slate-400 text-sm mb-3">Trading Symbol</p>
          <div className="flex flex-wrap gap-2">
            {SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => handleSymbolChange(sym)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  symbol === sym
                    ? "bg-emerald-600 text-white scale-105"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signal Card */}
          <div className="lg:col-span-1">
            {loading ? (
              <div className="card animate-pulse">
                <div className="h-8 bg-slate-700 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-6 bg-slate-700 rounded"></div>
                  <div className="h-6 bg-slate-700 rounded"></div>
                  <div className="h-6 bg-slate-700 rounded"></div>
                </div>
              </div>
            ) : data ? (
              <SignalCard signal={data} price={data.price} timestamp={data.timestamp} />
            ) : (
              <div className="card text-slate-400">Loading signal data...</div>
            )}
          </div>

          {/* Price Chart */}
          <div className="lg:col-span-2">
            <PriceChart symbol={symbol} priceHistory={priceHistory} recentData={data} />
          </div>
        </div>

        {/* Trade History */}
        <TradeHistory trades={trades} />

        {/* Stats Footer */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-slate-400 text-sm">Current Price</p>
            <p className="text-2xl font-bold text-emerald-400">${data?.price?.toFixed(2) || "—"}</p>
          </div>
          <div className="card text-center">
            <p className="text-slate-400 text-sm">24h High</p>
            <p className="text-2xl font-bold text-slate-300">${data?.high?.toFixed(2) || "—"}</p>
          </div>
          <div className="card text-center">
            <p className="text-slate-400 text-sm">24h Low</p>
            <p className="text-2xl font-bold text-slate-300">${data?.low?.toFixed(2) || "—"}</p>
          </div>
          <div className="card text-center">
            <p className="text-slate-400 text-sm">Status</p>
            <p className={`text-2xl font-bold ${connected ? "text-emerald-400" : "text-red-400"}`}>
              {connected ? "Live" : "Offline"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
