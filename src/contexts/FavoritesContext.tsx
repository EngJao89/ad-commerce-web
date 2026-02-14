"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Product } from "@/@types/products";
import type { FavoritesContextValue } from "@/@types/favorites";

const STORAGE_KEY = "ad-commerce-favorites";

function loadFromStorage(): Product[] {
  /* c8 ignore start -- SSR guard, window is always defined in jsdom */
  if (typeof globalThis.window === "undefined") return [];
  /* c8 ignore stop */
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: Product[]) {
  /* c8 ignore start -- SSR guard, window is always defined in jsdom */
  if (typeof globalThis.window === "undefined") return;
  /* c8 ignore stop */
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    queueMicrotask(() => {
      setItems(stored);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(items);
  }, [items, hydrated]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const toggle = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  }, []);

  const isFavorite = useCallback(
    (productId: number) => items.some((p) => p.id === productId),
    [items]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({ items, add, remove, toggle, isFavorite }),
    [items, add, remove, toggle, isFavorite]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
