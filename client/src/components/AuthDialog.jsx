import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthDialog = ({ mode, loading, error, onLogin, onSignup, onSwitchMode, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 backdrop-blur-sm sm:p-4" onClick={onClose}>
    <div className="relative z-10 w-full max-w-md">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-0 top-0 rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] px-2 py-1 text-xs text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)] sm:-right-2 sm:-top-2"
      >
        Close
      </button>

      <div className="max-h-[85vh] overflow-y-auto pt-8 sm:pt-0" onClick={(event) => event.stopPropagation()}>
        {mode === "login" ? (
          <LoginForm loading={loading} error={error} onSubmit={onLogin} onSwitch={() => onSwitchMode("signup")} />
        ) : (
          <SignupForm loading={loading} error={error} onSubmit={onSignup} onSwitch={() => onSwitchMode("login")} />
        )}
      </div>
    </div>
  </div>
);

export default AuthDialog;
