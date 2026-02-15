"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextValue } from "@/@types/auth";
import { getUserIdFromToken } from "@/lib/jwt";

const STORAGE_KEY = "ad-commerce-token";
const USER_ID_KEY = "ad-commerce-user-id";

function getStoredToken(): string | null {
  if (typeof globalThis.window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getStoredUserId(): number | null {
  if (typeof globalThis.window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_ID_KEY);
    if (raw == null) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null) {
  try {
    if (typeof globalThis.window === "undefined") return;
    if (token) localStorage.setItem(STORAGE_KEY, token);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function setStoredUserId(userId: number | null) {
  try {
    if (typeof globalThis.window === "undefined") return;
    if (userId != null) localStorage.setItem(USER_ID_KEY, String(userId));
    else localStorage.removeItem(USER_ID_KEY);
  } catch {
    // ignore
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [userId, setUserId] = useState<number | null>(getStoredUserId);
  const [openLogin, setOpenLogin] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (getStoredUserId() != null) return;
    const fromToken = getUserIdFromToken(token);
    if (fromToken == null) return;
    queueMicrotask(() => {
      setStoredUserId(fromToken);
      setUserId(fromToken);
    });
  }, [token]);

  const login = useCallback((newToken: string, newUserId?: number) => {
    setToken(newToken);
    setStoredToken(newToken);
    const resolved = newUserId ?? getUserIdFromToken(newToken);
    if (resolved != null) {
      setUserId(resolved);
      setStoredUserId(resolved);
    } else {
      setUserId(null);
      setStoredUserId(null);
    }
    setOpenLogin(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setStoredToken(null);
    setStoredUserId(null);
  }, []);

  const requestLogin = useCallback(() => {
    setOpenLogin(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      isAuthenticated: Boolean(token),
      login,
      logout,
      openLogin,
      setOpenLogin,
      requestLogin,
    }),
    [token, userId, openLogin, login, logout, requestLogin]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
