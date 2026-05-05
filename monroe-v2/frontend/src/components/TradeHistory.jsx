export default function TradeHistory({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Trade History</h2>
        <p className="text-slate-400">No trades yet</p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-xl font-bold text-slate-100">Recent Trades</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 px-2 text-slate-400">Symbol</th>
              <th className="text-left py-2 px-2 text-slate-400">Side</th>
              <th className="text-right py-2 px-2 text-slate-400">Qty</th>
              <th className="text-right py-2 px-2 text-slate-400">Entry</th>
              <th className="text-right py-2 px-2 text-slate-400">Exit</th>
              <th className="text-right py-2 px-2 text-slate-400">PnL</th>
              <th className="text-left py-2 px-2 text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, idx) => (
              <tr key={idx} className="border-b border-slate-800 hover:bg-slate-700 transition-colors">
                <td className="py-2 px-2 font-semibold">{trade.symbol}</td>
                <td className="py-2 px-2 capitalize">
                  <span className={trade.side === "buy" ? "text-emerald-400" : "text-red-400"}>
                    {trade.side}
                  </span>
                </td>
                <td className="py-2 px-2 text-right">{trade.qty}</td>
                <td className="py-2 px-2 text-right">${trade.entry_price?.toFixed(2)}</td>
                <td className="py-2 px-2 text-right">
                  {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : "—"}
                </td>
                <td className={`py-2 px-2 text-right font-semibold ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {trade.pnl >= 0 ? "+" : ""}{trade.pnl?.toFixed(2)}
                </td>
                <td className="py-2 px-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    trade.state === "open" ? "bg-blue-900 text-blue-200" : "bg-slate-700 text-slate-300"
                  }`}>
                    {trade.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
