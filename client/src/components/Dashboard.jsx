import { useMemo, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = ({ analytics, onAddReading, addingReading }) => {
  const [value, setValue] = useState("");
  const [recordedAt, setRecordedAt] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numericValue = Number(value);
    if (!numericValue || Number.isNaN(numericValue)) {
      setError("Enter a valid sugar value.");
      return;
    }

    setError("");
    await onAddReading({
      value: numericValue,
      recordedAt: recordedAt || undefined
    });

    setValue("");
    setRecordedAt("");
  };

  const chartData = useMemo(() => {
    const labels = (analytics?.last7Days || []).map((item) =>
      new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })
    );

    return {
      labels,
      datasets: [
        {
          label: "Avg sugar (mg/dL)",
          data: (analytics?.last7Days || []).map((item) => item.average),
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.2)",
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 5
        }
      ]
    };
  }, [analytics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#cbd5e1" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(71, 85, 105, 0.25)" }
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(71, 85, 105, 0.25)" }
      }
    }
  };

  return (
    <section className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Average sugar</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {analytics?.averageSugarLevel ?? "--"}
              <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">mg/dL</span>
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total readings</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-100">{analytics?.totalReadings ?? 0}</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Last 7 days</p>
            <p className="mt-1 text-3xl font-semibold text-slate-800 dark:text-slate-100">
              {(analytics?.last7Days || []).reduce((acc, item) => acc + item.count, 0)}
            </p>
          </article>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">7-day trend</h3>
          <div className="mt-4 h-72">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Add reading</h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Sugar value (mg/dL)</span>
                <input
                  type="number"
                  min="20"
                  max="600"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                  placeholder="e.g. 140"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-slate-600 dark:text-slate-300">Date & time (optional)</span>
                <input
                  type="datetime-local"
                  value={recordedAt}
                  onChange={(event) => setRecordedAt(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none transition focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button
                type="submit"
                disabled={addingReading}
                className="w-full rounded-xl bg-brand-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingReading ? "Saving..." : "Save reading"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900/70 lg:col-span-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Recent readings</h3>
            <div className="mt-4 space-y-2">
              {(analytics?.recentReadings || [])
                .slice()
                .reverse()
                .slice(0, 12)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-800"
                  >
                    <p className="font-mono text-sm text-slate-800 dark:text-slate-100">
                      {item.value} {item.unit}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {new Date(item.recordedAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                ))}

              {!analytics?.recentReadings?.length ? (
                <p className="text-sm text-slate-500 dark:text-slate-500">No readings yet. Add one or share it in chat.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
