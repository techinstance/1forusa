// src/api/auth.ts
//
// ─────────────────────────────────────────────
//  React-Native ⇆ Node/Express API helper
//  • Uses 10.0.2.2 for Android-emulator → host machine
//  • Change BASE to your LAN IP for a real device
// ─────────────────────────────────────────────

interface AuthResponse {
  token: string;
  message?: string;
}

interface AuthPayload {
  [key: string]: any;
}

const BASE = 'http://10.0.2.2:5050/api/auth';

// Generic helper that POSTs JSON and returns parsed JSON.
// If the server returns non-JSON, we surface an error with the raw text
// so you can see what came back (e.g., HTML 404 page, proxy message, etc.).
const json = async (path: string, body: AuthPayload): Promise<AuthResponse> => {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await res.text(); // raw response

  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      // Show server's error message if available
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('Server replied with non-JSON:', text); // 🔍 debug aid
    throw new Error(
      res.ok ? 'Unexpected response from server' : text || (err as Error).message
    );
  }
};

// Named wrappers for each auth endpoint
export const register       = (payload: AuthPayload) => json('/register',        payload);
export const login          = (payload: AuthPayload) => json('/login',           payload);
export const forgotPassword = (payload: AuthPayload) => json('/forgot-password', payload);
export const verifyOtp      = (payload: AuthPayload) => json('/verify-otp',      payload);
export const resetPassword  = (payload: AuthPayload) => json('/reset-password',  payload);
