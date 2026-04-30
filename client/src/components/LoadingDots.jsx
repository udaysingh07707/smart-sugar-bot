const LoadingDots = () => (
  <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-300 bg-slate-100/80 px-4 py-3 text-slate-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-300 [animation-delay:0ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-300 [animation-delay:120ms]" />
    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-300 [animation-delay:240ms]" />
  </div>
);

export default LoadingDots;
