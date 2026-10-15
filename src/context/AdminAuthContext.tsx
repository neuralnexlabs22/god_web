"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const AUTH_KEY = "frames_of_divine_admin_auth";
const LEGACY_AUTH_KEYS = ["god_store_admin_auth", "colour_seven_admin_auth"];
const AUTH_EXPIRY_HOURS = 24;

// Default admin credentials for Frames of Divine
const VALID_USERNAMES = ["admin", "framesofdivine", "fod"];
const VALID_PASSWORDS = [
  "framesofdivineadmin",
  "framesofdivine",
  "fodadmin",
  "godstoreadmin",
  "colour7admin",
];

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

function getStoredAuth(): boolean {
  if (typeof window === "undefined") return false;
  let raw = localStorage.getItem(AUTH_KEY);
  if (!raw) {
    for (const legacyKey of LEGACY_AUTH_KEYS) {
      raw = localStorage.getItem(legacyKey);
      if (raw) break;
    }
  }
  if (!raw) return false;
  try {
    const { expiresAt } = JSON.parse(raw);
    if (new Date(expiresAt) > new Date()) return true;
    localStorage.removeItem(AUTH_KEY);
    LEGACY_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
    return false;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    LEGACY_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
    return false;
  }
}

function setStoredAuth() {
  if (typeof window === "undefined") return;
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + AUTH_EXPIRY_HOURS);
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({ authenticated: true, expiresAt: expiresAt.toISOString() })
  );
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  LEGACY_AUTH_KEYS.forEach((k) => localStorage.removeItem(k));
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(getStoredAuth());
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const normalizedUser = username.trim().toLowerCase();
    const userOk = VALID_USERNAMES.includes(normalizedUser);
    const passOk = VALID_PASSWORDS.includes(password);

    if (userOk && passOk) {
      setStoredAuth();
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
