export default function ConnectionStatus({ connected, error, wsStatus }) {
  return (
    <div className="card flex items-center justify-between border-t-2 border-t-monroe-gold-mid">
      <div className="flex items-center gap-5">
        <span className="relative flex h-4 w-4">
          <span className={`relative inline-flex h-4 w-4 ${connected ? "bg-monroe-gold-primary shadow-[0_0_12px_#D6B56D]" : "bg-monroe-accent-burgundy shadow-[0_0_12px_#5C1F27]"}`} />
        </span>
        <div>
          <p className="text-ui-label text-monroe-gold-primary font-black tracking-[0.2em]">
            {connected ? "System Online" : "System Offline"}
          </p>
          <p className="text-[9px] text-monroe-text-secondary uppercase tracking-[0.25em] font-sans mt-2 opacity-60">
            {wsStatus || "Broadcast Ready"}
          </p>
        </div>
      </div>
      {error && (
        <div className="text-monroe-accent-burgundy text-[10px] max-w-xs text-right bg-monroe-accent-oxblood/20 px-5 py-2 border border-monroe-accent-burgundy/30 font-serif uppercase tracking-widest">
          {error}
        </div>
      )}
    </div>
  );
}
