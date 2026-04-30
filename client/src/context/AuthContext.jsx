import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);

const STORAGE_KEY = "gluco-chat-auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setLoadingAuth(false);
      return;
    }

    const parsed = JSON.parse(stored);
    if (!parsed.token) {
      setLoadingAuth(false);
      return;
    }

    setToken(parsed.token);

    authApi
      .me(parsed.token)
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setToken("");
        setUser(null);
      })
      .finally(() => {
        setLoadingAuth(false);
      });
  }, []);

  const persistAuth = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: authToken }));
  };

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    persistAuth(data.token, data.user);
  };

  const login = async (payload) => {
    const data = await authApi.login(payload);
    persistAuth(data.token, data.user);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loadingAuth,
      signup,
      login,
      logout
    }),
    [token, user, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
