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
            ? "rounded-br-md bg-brand-500/90 text-slate-950"
            : "rounded-bl-md border border-slate-300 bg-slate-100/90 text-slate-800 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        <p className={`mt-2 text-[11px] ${isUser ? "text-slate-900/80" : "text-slate-500 dark:text-slate-500"}`}>
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
