import { useState } from "react";

const SignupForm = ({ onSubmit, loading, error, onSwitch }) => {
  const [form, setForm] = useState({
    name: "",
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
    <div className="w-full max-w-md rounded-2xl border border-slate-800/50 bg-slate-900/70 p-8 shadow-glow backdrop-blur">
      <h1 className="text-3xl font-semibold text-slate-100">Create account</h1>
      <p className="mt-2 text-sm text-slate-400">Start saving blood sugar readings and AI-guided tips.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-200">Name</span>
          <input
            required
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none transition focus:border-brand-400"
            placeholder="John Doe"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-200">Email</span>
          <input
            required
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none transition focus:border-brand-400"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm text-slate-200">Password</span>
          <input
            required
            minLength={6}
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-slate-100 outline-none transition focus:border-brand-400"
            placeholder="At least 6 characters"
          />
        </label>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-400">
        Already have an account?{" "}
        <button className="font-medium text-brand-300 hover:text-brand-200" onClick={onSwitch} type="button">
          Login
        </button>
      </p>
    </div>
  );
};

export default SignupForm;
