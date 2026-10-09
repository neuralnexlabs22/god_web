"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "colour_seven_homepage_content";
type HomepageContentMap = Record<string, Record<string, unknown>>;

interface HomepageContentContextType {
  content: HomepageContentMap;
  loaded: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  updateSection: (sectionName: string, content: Record<string, unknown>) => Promise<void>;
  getSection: (sectionName: string) => Record<string, unknown> | undefined;
}

const HomepageContentContext = createContext<HomepageContentContextType | undefined>(undefined);

export function HomepageContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<HomepageContentMap>({});
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const stored = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
      setContent(stored ? JSON.parse(stored) as HomepageContentMap : {});
    } catch {
      setContent({});
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  const updateSection = useCallback(async (sectionName: string, sectionContent: Record<string, unknown>) => {
    const next = { ...content, [sectionName]: sectionContent };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setContent(next);
    } catch {
      throw new Error("Could not save homepage content in this browser");
    }
  }, [content]);

  const getSection = useCallback((sectionName: string) => content[sectionName], [content]);

  return (
    <HomepageContentContext.Provider value={{ content, loaded, loading, refresh, updateSection, getSection }}>
      {children}
    </HomepageContentContext.Provider>
  );
}

export function useHomepageContent() {
  const context = useContext(HomepageContentContext);
  if (!context) throw new Error("useHomepageContent must be used within a HomepageContentProvider");
  return context;
}