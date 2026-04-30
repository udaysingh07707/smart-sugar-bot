import { useState } from "react";

const LoginForm = ({ onSubmit, loading, error, onSwitch }) => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-8 backdrop-blur">
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Welcome back</h1>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Log in to continue tracking your blood sugar trends.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm text-[var(--text-primary)]">Email</span>
          <input
            required
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-4 py-2.5 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-[var(--text-primary)]">Password</span>
          <input
            required
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-4 py-2.5 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
            placeholder="••••••••"
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--accent-contrast)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-5 text-sm text-[var(--text-muted)]">
        Need an account?{" "}
        <button className="font-medium underline" onClick={onSwitch} type="button">
          Create one
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
