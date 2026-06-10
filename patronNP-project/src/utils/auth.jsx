import { jwtDecode } from "jwt-decode";

// ------------------------
// GET TOKEN
// ------------------------
export const getToken = () => {
  return localStorage.getItem("accessToken");
};

// ------------------------
// GET USER FROM JWT
// ------------------------
export const getAuthUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    return null;
  }
};

// ------------------------
// IS LOGGED IN
// ------------------------
export const isAuthenticated = () => {
  return !!getToken();
};

// ------------------------
// IS OWNER OF PROFILE
// ------------------------
export const isOwner = (profileUsername) => {
  const user = getAuthUser();
  return user?.username === profileUsername;
};

// ------------------------
// LOGOUT (GLOBAL CLEANUP)
// ------------------------
export const logoutUser = (navigate) => {
  localStorage.clear();
  sessionStorage.clear();

  navigate("/signin", { replace: true });
};