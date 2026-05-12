import { useState } from "react";
import MessageBubble from "./MessageBubble";
import LoadingDots from "./LoadingDots";

const ChatWindow = ({ messages, onSend, loading, title }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--bg-divider)] px-4 py-4 md:px-6">
        <h2 className="truncate text-base font-semibold md:text-lg">{title || "New chat"}</h2>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 md:px-8 md:py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {!messages.length ? (
            <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-5 text-center md:p-6">
              <p className="text-[var(--text-primary)]">Share a message like: "My sugar level is 140".</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Your readings will be auto-saved and used in analytics.</p>
            </div>
          ) : null}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {loading ? (
            <div className="flex justify-start">
              <LoadingDots />
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-[var(--bg-divider)] p-3 md:p-6">
        <form className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-contrast)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatWindow;
