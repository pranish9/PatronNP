import { jwtDecode } from "jwt-decode";

export const getTokenExpiry = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp ? exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const expiry = getTokenExpiry(token);
  return !expiry || expiry <= Date.now();
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/signin";
};

let logoutTimerId = null;

export const scheduleAutoLogout = () => {
  if (logoutTimerId) {
    clearTimeout(logoutTimerId);
    logoutTimerId = null;
  }

  const token = localStorage.getItem("accessToken");
  if (!token) return;

  const expiry = getTokenExpiry(token);
  if (!expiry) return;

  const msUntilExpiry = expiry - Date.now();

  if (msUntilExpiry <= 0) {
    logout();
    return;
  }

  logoutTimerId = setTimeout(() => {
    logout();
  }, msUntilExpiry);
};

export const cancelAutoLogout = () => {
  if (logoutTimerId) {
    clearTimeout(logoutTimerId);
    logoutTimerId = null;
  }
};
