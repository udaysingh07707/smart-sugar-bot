const ThemeToggle = ({ darkMode, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
  >
    {darkMode ? "Light mode" : "Dark mode"}
  </button>
);

export default ThemeToggle;
