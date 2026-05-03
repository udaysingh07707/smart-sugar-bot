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
    if (!Number.isFinite(numericValue)) {
      setError("Enter a valid sugar value.");
      return;
    }
    if (numericValue < 20 || numericValue > 600) {
      setError("Value should be between 20 and 600 mg/dL.");
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

  const hasTrendData = (analytics?.last7Days || []).some((item) => Number.isFinite(item.average));

  const chartData = useMemo(() => {
    const labels = (analytics?.last7Days || []).map((item) =>
      new Date(item.date).toLocaleDateString(undefined, { weekday: "short" })
    );

    return {
      labels,
      datasets: [
        {
          label: "Avg sugar (mg/dL)",
          data: (analytics?.last7Days || []).map((item) => (Number.isFinite(item.average) ? item.average : null)),
          borderColor: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.18)",
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 5,
          spanGaps: true
        }
      ]
    };
  }, [analytics]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#ececec" }
      }
    },
    scales: {
      x: {
        ticks: { color: "#8a8a8a" },
        grid: { color: "rgba(138, 138, 138, 0.2)" }
      },
      y: {
        ticks: { color: "#8a8a8a" },
        grid: { color: "rgba(138, 138, 138, 0.2)" }
      }
    }
  };

  return (
    <section className="h-full overflow-y-auto bg-[var(--bg-main)] p-3 md:p-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5">
            <p className="text-sm text-[var(--text-muted)]">Average sugar</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {analytics?.averageSugarLevel ?? "--"}
              <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">mg/dL</span>
            </p>
          </article>

          <article className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5">
            <p className="text-sm text-[var(--text-muted)]">Total readings</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">{analytics?.totalReadings ?? 0}</p>
          </article>

          <article className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5">
            <p className="text-sm text-[var(--text-muted)]">Last 7 days</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text-primary)] md:text-3xl">
              {(analytics?.last7Days || []).reduce((acc, item) => acc + item.count, 0)}
            </p>
          </article>
        </div>

        <div className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">7-day trend</h3>
          <div className="mt-4 h-64 md:h-72">
            {hasTrendData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                No chart points yet. Add a reading to start the trend graph.
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5 lg:col-span-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Add reading</h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-1 block text-sm text-[var(--text-muted)]">Sugar value (mg/dL)</span>
                <input
                  type="number"
                  min="20"
                  max="600"
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  className="w-full rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-3 py-2.5 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
                  placeholder="e.g. 140"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm text-[var(--text-muted)]">Date & time (optional)</span>
                <input
                  type="datetime-local"
                  value={recordedAt}
                  onChange={(event) => setRecordedAt(event.target.value)}
                  className="w-full rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-3 py-2.5 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)]"
                />
              </label>

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}

              <button
                type="submit"
                disabled={addingReading}
                className="w-full rounded-xl bg-[var(--accent)] px-4 py-2.5 font-semibold text-[var(--accent-contrast)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {addingReading ? "Saving..." : "Save reading"}
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-4 md:p-5 lg:col-span-3">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent readings</h3>
            <div className="mt-4 space-y-2">
              {(analytics?.recentReadings || [])
                .slice()
                .reverse()
                .slice(0, 12)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-start gap-1 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-main)] px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="font-mono text-sm text-[var(--text-primary)]">
                      {item.value} {item.unit}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] sm:text-right">
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
                <p className="text-sm text-[var(--text-muted)]">No readings yet. Add one or share it in chat.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
