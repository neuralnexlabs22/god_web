"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "colour_seven_site_settings";
type SettingsMap = Record<string, Record<string, unknown>>;

interface SiteSettingsContextType {
  settings: SettingsMap;
  loaded: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSetting: (key: string, value: Record<string, unknown>) => Promise<void>;
  getSetting: (key: string) => Record<string, unknown> | undefined;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const stored = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
      setSettings(stored ? JSON.parse(stored) as SettingsMap : {});
    } catch {
      setSettings({});
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  const updateSetting = useCallback(async (key: string, value: Record<string, unknown>) => {
    const next = { ...settings, [key]: value };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSettings(next);
    } catch {
      throw new Error("Could not save settings in this browser");
    }
  }, [settings]);

  const getSetting = useCallback((key: string) => settings[key], [settings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loaded, loading, refresh, updateSetting, getSetting }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  return context;
}