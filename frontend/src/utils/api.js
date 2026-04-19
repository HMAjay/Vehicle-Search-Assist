import { getToken, clearUser } from "./auth";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  // If token expired or invalid, force logout
  if (res.status === 401 && !path.startsWith("/auth")) {
    clearUser();
    window.location.href = "/";
    throw new Error(data.message || "Session expired");
  }

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  // Auth (no token needed)
  sendOtp: (email) =>
    request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  verifyOtp: (email, otp) =>
    request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getVehicleCount: () => request("/vehicles/count"),
  // Protected (token required)
  getVehicle: (vnum) => request(`/vehicles/${vnum}`),
  sendMessage: (senderId, receiverId, text) =>
    request("/messages/send", {
      method: "POST",
      body: JSON.stringify({ senderId, receiverId, text }),
    }),
  getConversation: (otherId, myId) =>
    request(`/messages/chat/${otherId}/${myId}`),
  deleteConversation: (otherId, myId) =>
    request(`/messages/chat/${otherId}/${myId}`, {
      method: "DELETE",
    }),
  getInbox: (userId) => request(`/messages/inbox/${userId}`),
  getUnreadCount: (userId) => request(`/messages/unread-count/${userId}`),
};
