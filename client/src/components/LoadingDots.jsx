const LoadingDots = () => (
  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-3 text-[var(--text-muted)]">
    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:0ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:120ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--accent)] [animation-delay:240ms]" />
  </div>
);

export default LoadingDots;
