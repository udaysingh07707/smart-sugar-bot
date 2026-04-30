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
    <section className="flex h-full flex-col">
      <header className="border-b border-slate-200 px-6 py-4 dark:border-slate-800/80">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title || "New chat"}</h2>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
          {!messages.length ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/70 p-6 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-slate-700 dark:text-slate-300">Share a message like: "My sugar level is 140".</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">Your readings will be auto-saved and used in analytics.</p>
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

      <div className="border-t border-slate-200 p-4 dark:border-slate-800/80 md:p-6">
        <form className="mx-auto flex w-full max-w-3xl gap-3" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="flex-1 rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-500 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brand-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
};

export default ChatWindow;
