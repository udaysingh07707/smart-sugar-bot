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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.16),transparent_32%),radial-gradient(circle_at_50%_85%,rgba(34,197,94,0.14),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/20 text-cyan-200 shadow-glow">G</div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200/80">GlucoGuide AI</p>
            <p className="text-xs text-slate-400">Smart sugar tracking companion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Log in
          </button>
          <button
            onClick={onSignup}
            className="rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Create account
          </button>
          <button
            onClick={onToggleTheme}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-86px)] w-full max-w-6xl items-center px-5 pb-10">
        <section className="mx-auto w-full max-w-4xl">
          <div className="mx-auto mb-8 w-fit rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Keep private sugar records and instant AI guidance
          </div>

          <h1 className="text-center text-4xl font-semibold leading-tight text-slate-50 md:text-6xl">
            Your sugar tracker, built for real daily life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-300 md:text-lg">
            Start with one message. We will ask for login when you submit, then save your history, readings, and trends securely.
          </p>

          <div className="mt-9 rounded-3xl border border-slate-700/80 bg-slate-900/80 p-4 shadow-[0_30px_80px_rgba(2,6,23,0.5)] backdrop-blur md:p-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-xl border border-cyan-300/30 bg-cyan-300/15 px-3 py-1.5 text-sm text-cyan-100">Sugar Check</span>
              <span className="rounded-xl border border-emerald-300/30 bg-emerald-300/15 px-3 py-1.5 text-sm text-emerald-100">Trend Insight</span>
              <span className="rounded-xl border border-amber-300/30 bg-amber-300/15 px-3 py-1.5 text-sm text-amber-100">Food Guidance</span>
            </div>

            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-40 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                placeholder='Try: "My sugar level is 142 after dinner. Is that okay?"'
              />

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">You will be asked to log in before starting the chat.</p>
                <button
                  type="submit"
                  disabled={!prompt.trim()}
                  className="rounded-xl bg-cyan-300 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                onClick={() => handleQuickPrompt(item)}
                className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-100"
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
