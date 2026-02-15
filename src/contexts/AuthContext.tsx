"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextValue } from "@/@types/auth";

const STORAGE_KEY = "ad-commerce-token";

function getStoredToken(): string | null {
  if (typeof globalThis.window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEY);
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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [openLogin, setOpenLogin] = useState(false);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
    setStoredToken(newToken);
    setOpenLogin(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setStoredToken(null);
  }, []);

  const requestLogin = useCallback(() => {
    setOpenLogin(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      openLogin,
      setOpenLogin,
      requestLogin,
    }),
    [token, openLogin, login, logout, requestLogin]
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
