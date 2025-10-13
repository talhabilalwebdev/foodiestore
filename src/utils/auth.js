// src/utils/auth.js


// Save user info
export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));

// Get user info
export const getUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Save token
export const setToken = (token) => localStorage.setItem("token", token);

// Get token
export const getToken = () => localStorage.getItem("token");

// Remove token (logout)
export const removeToken = () => localStorage.removeItem("token");

// Decode JWT and check expiry
export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.exp * 1000 < Date.now()) {
      removeToken();
      return true;
    }
    return false;
  } catch (err) {
    return true; // treat invalid tokens as expired
  }
};

// Fetch wrapper with Authorization + auto-logout if 401
export const authFetch = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  // Handle token expiration (401 Unauthorized)
  if (res.status === 401) {
    removeToken();
    window.location.href = "/login"; // force redirect to login
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed");
  }

  return res.json();
};
