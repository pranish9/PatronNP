// Backend origin prefix for the handful of call sites that build their own
// URLs instead of going through apiClient. Empty string = relative, which
// resolves through the Vite dev server's proxy (see vite.config.js) to the
// backend — works unchanged over localhost, a LAN IP, or an ngrok tunnel.
// Set VITE_API_HOST only if you need to point at a backend that ISN'T
// reachable via this dev server's own proxy.
export const API_HOST = import.meta.env.VITE_API_HOST || '';

export default API_HOST;
