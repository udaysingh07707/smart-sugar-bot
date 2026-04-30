const formatMessageTime = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
          isUser
            ? "bg-[var(--bg-bubble-user)] text-[var(--accent-contrast)] rounded-br-md"
            : "bg-[var(--bg-bubble-bot)] text-[var(--text-primary)] rounded-bl-md border border-[var(--bg-divider)]"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        <p className={`mt-2 text-[11px] ${isUser ? "text-[var(--accent-contrast)]/70" : "text-[var(--text-muted)]"}`}>
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
