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
  <aside className="flex h-full w-full flex-col bg-[var(--bg-sidebar)] border-r border-[var(--bg-divider)]">
    <div className="border-b border-[var(--bg-divider)] p-4">
      <button
        type="button"
        onClick={onNewChat}
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-contrast)] transition hover:opacity-90"
      >
        + New chat
      </button>
    </div>

    <div className="flex gap-2 border-b border-[var(--bg-divider)] px-4 py-3">
      <button
        type="button"
        className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
          activeView === "chat"
            ? "bg-[var(--bg-input)] text-[var(--text-primary)]"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
        }`}
        onClick={() => onViewChange("chat")}
      >
        Chat
      </button>
      <button
        type="button"
        className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
          activeView === "dashboard"
            ? "bg-[var(--bg-input)] text-[var(--text-primary)]"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
        }`}
        onClick={() => onViewChange("dashboard")}
      >
        Dashboard
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-3">
      <p className="px-2 text-xs uppercase tracking-wider text-[var(--text-muted)]">Chat history</p>
      <div className="mt-2 space-y-2">
        {sessions.map((session) => (
          <button
            type="button"
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`w-full rounded-xl px-3 py-2 text-left transition ${
              activeSessionId === session.id
                ? "bg-[var(--bg-bubble-user)] text-[var(--accent-contrast)]"
                : "border border-transparent hover:border-[var(--bg-divider)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)]"
            }`}
          >
            <p className="truncate text-sm font-medium text-[var(--text-primary)]">{session.title}</p>
            <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{session.lastMessagePreview || "No messages yet"}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">{formatSessionDate(session.lastMessageAt)}</p>
          </button>
        ))}

        {!sessions.length ? <p className="px-2 pt-2 text-xs text-[var(--text-muted)]">No previous chats yet.</p> : null}
      </div>
    </div>

    <div className="border-t border-[var(--bg-divider)] p-4">
      <p className="truncate text-sm text-[var(--text-primary)]">{user?.name}</p>
      <p className="truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
      <button
        type="button"
        onClick={onLogout}
        className="mt-3 w-full rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)]"
      >
        Logout
      </button>
    </div>
  </aside>
);

export default Sidebar;
