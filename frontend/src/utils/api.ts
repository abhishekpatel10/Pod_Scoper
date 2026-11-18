/**
 * Production-ready API URL resolution utility.
 * 
 * - In local dev (Vite proxy) or unified Docker deployment:
 *   VITE_API_BASE_URL is unset, returning relative paths ('/api/health', '/api/analyze/stream').
 * - In split frontend/backend deployments (e.g. Vercel frontend + Render backend):
 *   Set VITE_API_BASE_URL=https://your-backend.onrender.com to direct API calls to the remote host.
 */
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const apiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
