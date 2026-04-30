import { useState } from "react";

const quickPrompts = [
  "My fasting sugar is 124 today. What should I do next?",
  "Track my post-lunch sugar at 168 mg/dL.",
  "Explain what a safe weekly sugar trend looks like."
];

const LandingPage = ({ onStart, onLogin, onSignup, darkMode, onToggleTheme }) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onStart(prompt.trim());
  };

  const handleQuickPrompt = (value) => {
    setPrompt(value);
    onStart(value);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)]">
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-[var(--accent-contrast)] shadow-sm">G</div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">GlucoGuide AI</p>
            <p className="text-xs text-[var(--text-muted)]">Smart sugar tracking companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLogin}
            className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onSignup}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-contrast)] transition hover:opacity-90"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={onToggleTheme}
            className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-6xl items-center px-5 pb-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="mx-auto mb-8 w-fit rounded-full border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-2 text-sm text-[var(--text-muted)]">
            Keep private sugar records and instant AI guidance
          </div>

          <h1 className="text-center text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-6xl">
            Your sugar tracker, built for real daily life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--text-muted)] md:text-lg">
            Start with one message. We will ask for login when you submit, then save your history, readings, and trends securely.
          </p>

          <div className="mt-9 rounded-3xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 shadow-lg md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-hover)] px-3 py-1.5 text-sm text-[var(--text-primary)]">Sugar Check</span>
              <span className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-hover)] px-3 py-1.5 text-sm text-[var(--text-primary)]">Trend Insight</span>
              <span className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-hover)] px-3 py-1.5 text-sm text-[var(--text-primary)]">Food Guidance</span>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-40 w-full resize-none rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-4 py-4 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
                placeholder='Try: "My sugar level is 142 after dinner. Is that okay?"'
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-[var(--text-muted)]">You will be asked to log in before starting the chat.</p>
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="rounded-xl bg-[var(--accent)] px-5 py-2.5 font-semibold text-[var(--accent-contrast)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start tracking
                </button>
              </div>
            </form>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {quickPrompts.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickPrompt(item)}
                className="rounded-full border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
              >
                {item}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
