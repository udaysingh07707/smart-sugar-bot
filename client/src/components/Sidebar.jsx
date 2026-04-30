const formatSessionDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const Sidebar = ({ sessions, activeSessionId, onSelectSession, onNewChat, onLogout, user, activeView, onViewChange }) => (
  <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-slate-100/90 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
    <div className="border-b border-slate-200 p-4 dark:border-slate-800/80">
      <button
        onClick={onNewChat}
        className="w-full rounded-xl border border-brand-400/30 bg-brand-500/15 px-4 py-2 text-sm font-medium text-brand-200 transition hover:bg-brand-500/25"
      >
        + New chat
      </button>
    </div>

    <div className="flex gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800/80">
      <button
        className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
          activeView === "chat"
            ? "bg-slate-800 text-slate-100 dark:bg-slate-800 dark:text-slate-100"
            : "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-900"
        }`}
        onClick={() => onViewChange("chat")}
      >
        Chat
      </button>
      <button
        className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
          activeView === "dashboard"
            ? "bg-slate-800 text-slate-100 dark:bg-slate-800 dark:text-slate-100"
            : "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-900"
        }`}
        onClick={() => onViewChange("dashboard")}
      >
        Dashboard
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-3">
      <p className="px-2 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-500">Chat history</p>
      <div className="mt-2 space-y-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full rounded-xl px-3 py-2 text-left transition ${
              activeSessionId === session.id
                ? "border border-brand-400/40 bg-brand-500/10"
                : "border border-transparent hover:border-slate-300 hover:bg-slate-200 dark:hover:border-slate-800 dark:hover:bg-slate-900/60"
            }`}
          >
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{session.title}</p>
            <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{session.lastMessagePreview || "No messages yet"}</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-500">{formatSessionDate(session.lastMessageAt)}</p>
          </button>
        ))}

        {!sessions.length ? <p className="px-2 pt-2 text-xs text-slate-500 dark:text-slate-500">No previous chats yet.</p> : null}
      </div>
    </div>

    <div className="border-t border-slate-200 p-4 dark:border-slate-800/80">
      <p className="truncate text-sm text-slate-700 dark:text-slate-200">{user?.name}</p>
      <p className="truncate text-xs text-slate-500 dark:text-slate-500">{user?.email}</p>
      <button
        onClick={onLogout}
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;
