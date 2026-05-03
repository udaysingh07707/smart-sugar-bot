import { useEffect, useMemo, useState } from "react";
import { analyticsApi, chatApi, historyApi, sugarApi } from "./api/client";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import Dashboard from "./components/Dashboard";
import ThemeToggle from "./components/ThemeToggle";
import LandingPage from "./components/LandingPage";
import AuthDialog from "./components/AuthDialog";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { user, token, loadingAuth, signup, login, logout } = useAuth();

  const [authMode, setAuthMode] = useState("login");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [queuedPrompt, setQueuedPrompt] = useState("");

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [appError, setAppError] = useState("");

  const [activeView, setActiveView] = useState("chat");
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [addingReading, setAddingReading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("gluco-theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("gluco-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Load sidebar chat sessions for the authenticated user.
  const loadSessions = async () => {
    if (!token) return;
    const data = await historyApi.getSessions(token);
    setSessions(data.sessions || []);
  };

  // Load dashboard cards + chart data.
  const loadAnalytics = async () => {
    if (!token) return;
    setAnalyticsLoading(true);
    try {
      const data = await analyticsApi.getAnalytics(token);
      setAnalytics(data);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch and render messages for a selected historical chat session.
  const loadSessionMessages = async (sessionId) => {
    if (!token || !sessionId) return;
    setHistoryLoading(true);
    setAppError("");
    try {
      const data = await historyApi.getSessionMessages(token, sessionId);
      setActiveSessionId(sessionId);
      setMessages(data.messages || []);
      setActiveView("chat");
      setSidebarOpen(false);
    } catch (error) {
      setAppError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadSessions().catch((error) => setAppError(error.message));
    loadAnalytics().catch((error) => setAppError(error.message));
  }, [token]);

  useEffect(() => {
    if (!token || !queuedPrompt) return;
    const prompt = queuedPrompt;
    setQueuedPrompt("");
    setAuthDialogOpen(false);
    handleSendMessage(prompt, { startNewSession: true });
  }, [token, queuedPrompt]);

  const openAuthDialog = (mode = "login") => {
    setAuthMode(mode);
    setAuthError("");
    setAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogOpen(false);
    setAuthError("");
    setQueuedPrompt("");
  };

  const handleSignup = async (payload) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await signup(payload);
      setAuthDialogOpen(false);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      await login(payload);
      setAuthDialogOpen(false);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Optimistically render the user message, then append assistant reply.
  const handleSendMessage = async (content, options = {}) => {
    if (!token || chatLoading) return;
    const normalized = content.trim();
    if (!normalized) return;
    const startNewSession = Boolean(options.startNewSession);

    setAppError("");
    const localUserMessage = {
      id: `local-${Date.now()}`,
      role: "user",
      content: normalized,
      timestamp: new Date().toISOString()
    };

    if (startNewSession) {
      setActiveSessionId("");
      setMessages([localUserMessage]);
    } else {
      setMessages((prev) => [...prev, localUserMessage]);
    }

    setActiveView("chat");
    setChatLoading(true);

    try {
      const response = await chatApi.sendMessage(token, {
        message: normalized,
        sessionId: startNewSession ? undefined : activeSessionId || undefined
      });

      const resolvedSessionId = response.session.id;
      setActiveSessionId(resolvedSessionId);
      setMessages((prev) => [
        ...prev,
        {
          id: response.assistantMessage.id,
          role: "assistant",
          content: response.assistantMessage.content,
          timestamp: response.assistantMessage.timestamp
        }
      ]);

      await Promise.all([loadSessions(), loadAnalytics()]);
    } catch (error) {
      setAppError(error.message);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "I could not process that right now. Please try again.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId("");
    setMessages([]);
    setActiveView("chat");
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setSessions([]);
    setActiveSessionId("");
    setMessages([]);
    setAnalytics(null);
    setAppError("");
    setQueuedPrompt("");
    setAuthDialogOpen(false);
    setAuthError("");
  };

  const handleAddReading = async (payload) => {
    if (!token) return;
    setAddingReading(true);
    try {
      await sugarApi.addReading(token, payload);
      await loadAnalytics();
    } catch (error) {
      setAppError(error.message);
    } finally {
      setAddingReading(false);
    }
  };

  const activeSessionTitle = useMemo(
    () => sessions.find((item) => item.id === activeSessionId)?.title || "New chat",
    [sessions, activeSessionId]
  );

  const handleLandingStart = (prompt) => {
    if (!prompt) return;
    setQueuedPrompt(prompt);
    openAuthDialog("login");
  };

  const handleMobileViewChange = (view) => {
    setActiveView(view);
    setSidebarOpen(false);
  };

  if (loadingAuth) {
    return <div className="flex min-h-screen items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)]">Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <LandingPage
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((prev) => !prev)}
          onStart={handleLandingStart}
          onLogin={() => openAuthDialog("login")}
          onSignup={() => openAuthDialog("signup")}
        />
        {authDialogOpen ? (
          <AuthDialog
            mode={authMode}
            loading={authLoading}
            error={authError}
            onLogin={handleLogin}
            onSignup={handleSignup}
            onSwitchMode={(mode) => {
              setAuthMode(mode);
              setAuthError("");
            }}
            onClose={closeAuthDialog}
          />
        ) : null}
      </>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors">
      <div className="flex h-full md:grid md:grid-cols-[290px_1fr]">
        <div className="hidden h-full md:block">
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={loadSessionMessages}
            onNewChat={handleNewChat}
            onLogout={handleLogout}
            user={user}
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {sidebarOpen ? (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
            />
            <div className="relative h-full w-[86vw] max-w-sm">
              <Sidebar
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelectSession={loadSessionMessages}
                onNewChat={handleNewChat}
                onLogout={handleLogout}
                user={user}
                activeView={activeView}
                onViewChange={handleMobileViewChange}
                onClose={() => setSidebarOpen(false)}
                mobile
              />
            </div>
          </div>
        ) : null}

        <main className="relative flex h-full min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-[var(--bg-divider)] px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] text-lg text-[var(--text-primary)] transition hover:bg-[var(--bg-hover)] md:hidden"
                aria-label="Open navigation"
              >
                ☰
              </button>
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">GlucoGuide AI</p>
                <p className="text-sm text-[var(--text-primary)]">Chat + blood sugar analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-[var(--bg-divider)] bg-[var(--bg-input)] p-1 md:hidden">
                <button
                  type="button"
                  onClick={() => setActiveView("chat")}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    activeView === "chat" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("dashboard")}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${
                    activeView === "dashboard" ? "bg-[var(--accent)] text-[var(--accent-contrast)]" : "text-[var(--text-muted)]"
                  }`}
                >
                  Stats
                </button>
              </div>
              <ThemeToggle darkMode={darkMode} onToggle={() => setDarkMode((prev) => !prev)} />
            </div>
          </div>

          {appError ? (
            <div className="border-b border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">{appError}</div>
          ) : null}

          {activeView === "chat" ? (
            historyLoading ? (
              <div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">Loading chat...</div>
            ) : (
              <ChatWindow
                messages={messages}
                onSend={handleSendMessage}
                loading={chatLoading}
                title={activeSessionTitle}
              />
            )
          ) : analyticsLoading && !analytics ? (
            <div className="flex flex-1 items-center justify-center text-[var(--text-muted)]">Loading dashboard...</div>
          ) : (
            <Dashboard analytics={analytics} onAddReading={handleAddReading} addingReading={addingReading} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
