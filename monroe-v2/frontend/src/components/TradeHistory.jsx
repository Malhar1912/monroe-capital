export default function TradeHistory({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="card border-dashed">
        <h2 className="text-display text-xl text-monroe-gold-primary mb-4">Trade Ledger</h2>
        <p className="text-ui-label text-monroe-text-secondary opacity-50">Awaiting Records...</p>
      </div>
    );
  }

  return (
    <div className="card space-y-8">
      <div className="flex items-center justify-between border-b border-monroe-gold-muted/10 pb-5">
        <h2 className="text-display text-xl text-monroe-gold-primary">Trade Ledger</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-monroe-gold-muted/20">
              <th className="py-4 px-4 text-ui-label text-monroe-gold-muted">Asset</th>
              <th className="py-4 px-4 text-ui-label text-monroe-gold-muted">Side</th>
              <th className="text-right py-4 px-4 text-ui-label text-monroe-gold-muted">Volume</th>
              <th className="text-right py-4 px-4 text-ui-label text-monroe-gold-muted">Entry</th>
              <th className="text-right py-4 px-4 text-ui-label text-monroe-gold-muted">Exit</th>
              <th className="text-right py-4 px-4 text-ui-label text-monroe-gold-muted">Result (PnL)</th>
              <th className="text-center py-4 px-4 text-ui-label text-monroe-gold-muted">State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {trades.map((trade, idx) => (
              <tr key={idx} className="hover:bg-monroe-raised/50 transition-colors group">
                <td className="py-5 px-4 text-display text-sm text-monroe-text-primary">{trade.symbol}</td>
                <td className="py-5 px-4 capitalize">
                  <span className={`text-ui-label font-bold ${trade.side === "buy" ? "text-monroe-gold-primary" : "text-monroe-accent-burgundy"}`}>
                    {trade.side}
                  </span>
                </td>
                <td className="py-5 px-4 text-right text-value">{trade.qty}</td>
                <td className="py-5 px-4 text-right text-value opacity-80">${trade.entry_price?.toFixed(2)}</td>
                <td className="py-5 px-4 text-right text-value opacity-80">
                  {trade.exit_price ? `$${trade.exit_price.toFixed(2)}` : "—"}
                </td>
                <td className={`py-5 px-4 text-right text-value font-bold ${trade.pnl >= 0 ? "text-monroe-data-gain" : "text-monroe-data-loss"}`}>
                  {trade.pnl >= 0 ? "+" : ""}{trade.pnl?.toFixed(2)}
                </td>
                <td className="py-5 px-4 text-center">
                  <span className={`badge-default ${
                    trade.state === "open" ? "badge-gold" : "opacity-40"
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
