const ThemeToggle = ({ darkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
  >
    {darkMode ? "Light mode" : "Dark mode"}
  </button>
);

export default ThemeToggle;
