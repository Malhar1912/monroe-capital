export default function SignalCard({ signal, price, timestamp }) {
  const getPresenceColor = (presence) => {
    switch (presence) {
      case "Entering":
        return "bg-monroe-gold-primary/10 text-monroe-gold-primary border-monroe-gold-mid/30";
      case "Watching":
        return "bg-monroe-raised text-monroe-text-secondary border-monroe-gold-muted/20";
      default:
        return "bg-monroe-base text-monroe-text-secondary/60 border-monroe-gold-muted/10";
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "Quiet Uptrend":
        return "text-monroe-data-gain";
      case "Neutral":
        return "text-monroe-text-secondary";
      case "Guarded":
        return "text-monroe-data-loss";
      default:
        return "text-monroe-text-secondary";
    }
  };

  const getActionColor = (action) => {
    if (action === "Buy") return "bg-monroe-gold-mid text-monroe-base border-monroe-gold-primary";
    return "bg-monroe-accent-burgundy text-monroe-text-secondary border-monroe-accent-oxblood";
  };

  return (
    <div className="card space-y-8 relative overflow-hidden">
      <div className="flex justify-between items-center border-b border-monroe-gold-muted/10 pb-5">
        <h2 className="text-display text-2xl text-monroe-gold-primary">Signal</h2>
        <div className="text-ui-label text-monroe-text-secondary opacity-60">
          {timestamp ? new Date(timestamp).toLocaleTimeString() : "---"}
        </div>
      </div>

      {/* Primary Action Banner */}
      <div className={`p-6 border ${getActionColor(signal?.action)} flex flex-col items-center justify-center transition-all duration-700`}>
        <span className="text-ui-label opacity-80 mb-2">Recommended Action</span>
        <span className="text-display text-4xl font-bold">{signal?.action || "Hold"}</span>
      </div>

      <div className="divider"></div>

      {/* Price Display */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-monroe-base/40 p-4 border border-monroe-gold-muted/5">
          <p className="text-ui-label text-monroe-text-secondary mb-2">Price</p>
          <p className="text-value text-2xl">${price?.toFixed(2)}</p>
        </div>
        <div className="bg-monroe-base/40 p-4 border border-monroe-gold-muted/5">
          <p className="text-ui-label text-monroe-text-secondary mb-2">Bid</p>
          <p className="text-value text-xl opacity-80">${signal?.bid?.toFixed(2)}</p>
        </div>
        <div className="bg-monroe-base/40 p-4 border border-monroe-gold-muted/5">
          <p className="text-ui-label text-monroe-text-secondary mb-2">Ask</p>
          <p className="text-value text-xl opacity-80">${signal?.ask?.toFixed(2)}</p>
        </div>
      </div>

      {/* Monroe Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-monroe-base/20 p-5 border border-monroe-gold-muted/5">
          <p className="text-ui-label text-monroe-text-secondary mb-4">Presence</p>
          <span className={`badge-default border border-monroe-gold-muted/20 ${getPresenceColor(signal?.presence)}`}>
            {signal?.presence || "---"}
          </span>
        </div>
        <div className="bg-monroe-base/20 p-5 border border-monroe-gold-muted/5">
          <p className="text-ui-label text-monroe-text-secondary mb-3">Mood</p>
          <p className={`text-value text-lg font-bold ${getMoodColor(signal?.mood)}`}>
            {signal?.mood || "---"}
          </p>
        </div>
      </div>

      <div className="bg-monroe-base/20 p-5 border border-monroe-gold-muted/5">
        <p className="text-ui-label text-monroe-text-secondary mb-3">Selectivity</p>
        <p className="text-value text-xl tracking-widest font-bold">
          {signal?.selectivity || "---"}
        </p>
      </div>

      <div className="bg-monroe-raised p-6 border border-monroe-gold-muted/20">
        <div className="flex justify-between items-end mb-4">
          <p className="text-ui-label text-monroe-gold-primary font-bold">Poise Level</p>
          <span className="text-value text-3xl">{signal?.poise || 0}<span className="text-lg opacity-40">/5</span></span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level}
              className={`flex-1 h-1.5 transition-all duration-700 ${
                (signal?.poise || 0) >= level 
                  ? "bg-monroe-gold-mid shadow-[0_0_10px_#B9964A]" 
                  : "bg-monroe-base border border-monroe-gold-muted/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
