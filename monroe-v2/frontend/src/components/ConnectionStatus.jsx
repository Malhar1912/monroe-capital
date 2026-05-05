export default function ConnectionStatus({ connected, error, wsStatus }) {
  return (
    <div className="card flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
        <div>
          <p className="font-semibold text-slate-100">
            {connected ? "🟢 Connected" : "🔴 Disconnected"}
          </p>
          <p className="text-sm text-slate-400">
            {wsStatus || "WebSocket ready"}
          </p>
        </div>
      </div>
      {error && (
        <div className="text-red-400 text-sm max-w-xs text-right">
          {error}
        </div>
      )}
    </div>
  );
}
