export default function SignalCard({ signal, price, timestamp }) {
  const getPresenceColor = (presence) => {
    switch (presence) {
      case "Entering":
        return "bg-emerald-600";
      case "Watching":
        return "bg-slate-600";
      default:
        return "bg-slate-700";
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case "Quiet Uptrend":
        return "text-emerald-400";
      case "Neutral":
        return "text-slate-400";
      case "Guarded":
        return "text-red-400";
      default:
        return "text-slate-300";
    }
  };

  const getActionColor = (action) => {
    if (action === "Buy") return "text-emerald-400 font-bold";
    return "text-slate-400";
  };

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Monroe Signal</h2>
        <div className="text-sm text-slate-400">
          {timestamp ? new Date(timestamp).toLocaleTimeString() : "---"}
        </div>
      </div>

      {/* Price Display */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-sm">Current Price</p>
          <p className="text-2xl font-bold text-emerald-400">${price?.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-sm">Bid</p>
          <p className="text-lg font-semibold text-slate-200">${signal?.bid?.toFixed(2)}</p>
        </div>
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-sm">Ask</p>
          <p className="text-lg font-semibold text-slate-200">${signal?.ask?.toFixed(2)}</p>
        </div>
      </div>

      {/* Monroe Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400 text-sm">Presence</span>
            <span className={`status-badge ${getPresenceColor(signal?.presence)}`}>
              {signal?.presence}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-400 text-sm">Action</span>
            <span className={`status-badge font-bold ${signal?.action === "Buy" ? "bg-emerald-600" : "bg-slate-600"}`}>
              {signal?.action}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-sm mb-2">Mood</p>
          <p className={`text-lg font-semibold ${getMoodColor(signal?.mood)}`}>
            {signal?.mood}
          </p>
        </div>
        <div className="bg-slate-700 rounded p-4">
          <p className="text-slate-400 text-sm mb-2">Selectivity</p>
          <p className="text-lg font-semibold text-slate-200">
            {signal?.selectivity}
          </p>
        </div>
      </div>

      <div className="bg-slate-700 rounded p-4">
        <p className="text-slate-400 text-sm mb-2">Poise Level</p>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-slate-600 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full transition-all"
              style={{ width: `${(signal?.poise || 0) * 20}%` }}
            />
          </div>
          <span className="text-xl font-bold text-emerald-400">{signal?.poise}/5</span>
        </div>
      </div>
    </div>
  );
}
