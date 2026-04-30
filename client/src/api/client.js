const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, { method = "GET", token, body } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const authApi = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token })
};

export const chatApi = {
  sendMessage: (token, payload) => request("/chat", { method: "POST", token, body: payload })
};

export const historyApi = {
  getSessions: (token) => request("/history", { token }),
  getSessionMessages: (token, sessionId) => request(`/history/${sessionId}`, { token })
};

export const sugarApi = {
  addReading: (token, payload) => request("/sugar", { method: "POST", token, body: payload }),
  getReadings: (token, limit = 50) => request(`/sugar?limit=${limit}`, { token })
};

export const analyticsApi = {
  getAnalytics: (token) => request("/analytics", { token })
};
