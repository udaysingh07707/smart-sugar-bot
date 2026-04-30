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
    <section className="flex h-full flex-col bg-[var(--bg-main)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--bg-divider)] px-6 py-4">
        <h2 className="text-lg font-semibold">{title || "New chat"}</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {!messages.length ? (
            <div className="rounded-2xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-6 text-center">
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

      <div className="border-t border-[var(--bg-divider)] p-4 md:p-6">
        <form className="mx-auto flex w-full max-w-3xl gap-3" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-4 py-3 text-base text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-placeholder)] focus:border-[var(--accent)]"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-[var(--accent-contrast)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatWindow;
