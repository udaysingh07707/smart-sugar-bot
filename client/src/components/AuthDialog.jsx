import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthDialog = ({ mode, loading, error, onLogin, onSignup, onSwitchMode, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
    <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close login dialog" />
    <div className="relative z-10 w-full max-w-md">
      <button
        onClick={onClose}
        className="absolute -right-2 -top-2 rounded-full border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-200 transition hover:border-slate-400 hover:bg-slate-800"
      >
        Close
      </button>

      {mode === "login" ? (
        <LoginForm loading={loading} error={error} onSubmit={onLogin} onSwitch={() => onSwitchMode("signup")} />
      ) : (
        <SignupForm loading={loading} error={error} onSubmit={onSignup} onSwitch={() => onSwitchMode("login")} />
      )}
    </div>
  </div>
);

export default AuthDialog;
