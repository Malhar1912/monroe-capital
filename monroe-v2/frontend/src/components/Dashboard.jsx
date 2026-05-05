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
        const res = await api.get(`history/${symbol}`, {
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
        const res = await api.get("trades");
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
    const wsUrl = `${protocol}//monroe-capital.onrender.com/api/ws/${symbol}`;

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
    <div className="min-h-screen bg-transparent p-4 md:p-12">
      <div className="max-w-[1400px] mx-auto space-y-12">
        {/* Cinematic Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-[0.5px] border-monroe-gold-muted/20 pb-8">
          <div>
            <h1 className="text-display text-5xl text-monroe-gold-primary drop-shadow-lg">
              MONROE <span className="font-light text-monroe-accent-burgundy text-4xl">v2</span>
            </h1>
            <p className="text-ui-label text-monroe-text-secondary mt-3">Algorithmic Trading System</p>
          </div>
          <div className="text-left md:text-right mt-6 md:mt-0">
            <p className="text-ui-label text-monroe-gold-muted mb-2 font-bold tracking-widest">US Equities / Market Hub</p>
            <p className="text-value text-sm bg-monroe-surface px-4 py-1.5 border border-monroe-gold-primary/10">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <ConnectionStatus connected={connected} error={error} wsStatus={loading ? "Connecting..." : "Ready"} />

        {/* Symbol Selector */}
        <div className="card">
          <p className="text-ui-label text-monroe-gold-muted font-bold mb-5">Select Active Asset</p>
          <div className="flex flex-wrap gap-4">
            {SYMBOLS.map((sym) => (
              <button
                key={sym}
                onClick={() => handleSymbolChange(sym)}
                className={`px-8 py-2.5 font-bold tracking-widest transition-all duration-300 uppercase text-xs ${
                  symbol === sym
                    ? "bg-monroe-gold-mid text-monroe-base shadow-lg scale-105"
                    : "bg-monroe-raised text-monroe-text-secondary hover:text-monroe-gold-primary hover:bg-monroe-surface border border-monroe-gold-primary/5 hover:border-monroe-gold-primary/20"
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
                <div className="h-8 bg-monroe-raised rounded mb-8 w-1/2"></div>
                <div className="space-y-6">
                  <div className="h-24 bg-monroe-raised"></div>
                  <div className="h-24 bg-monroe-raised"></div>
                  <div className="h-24 bg-monroe-raised"></div>
                </div>
              </div>
            ) : data ? (
              <SignalCard signal={data} price={data.price} timestamp={data.timestamp} />
            ) : (
              <div className="card text-monroe-text-secondary/50 flex flex-col items-center justify-center h-full min-h-[400px] border-dashed">
                <p className="text-ui-label">Awaiting Film Noir Signal...</p>
              </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12">
          <div className="card relative group">
            <p className="text-ui-label text-monroe-text-secondary mb-2">Price Value</p>
            <p className="text-value text-4xl">${data?.price?.toFixed(2) || "—"}</p>
          </div>
          <div className="card relative group">
            <p className="text-ui-label text-monroe-text-secondary mb-2">Peak (24h)</p>
            <p className="text-value text-3xl opacity-80">${data?.high?.toFixed(2) || "—"}</p>
          </div>
          <div className="card relative group">
            <p className="text-ui-label text-monroe-text-secondary mb-2">Floor (24h)</p>
            <p className="text-value text-3xl opacity-80">${data?.low?.toFixed(2) || "—"}</p>
          </div>
          <div className="card flex flex-col justify-center items-center bg-monroe-raised border-t-2 border-t-monroe-gold-mid">
            <p className="text-ui-label text-monroe-gold-muted mb-3 font-bold">Protocol Status</p>
            <div className="flex items-center gap-4">
              <span className={`relative inline-flex h-3 w-3 ${connected ? 'bg-monroe-gold-primary shadow-[0_0_10px_#D6B56D]' : 'bg-monroe-accent-burgundy shadow-[0_0_10px_#5C1F27]'}`}></span>
              <p className={`text-ui-label text-lg font-bold ${connected ? "text-monroe-gold-primary" : "text-monroe-accent-burgundy"}`}>
                {connected ? "Active" : "Halted"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
