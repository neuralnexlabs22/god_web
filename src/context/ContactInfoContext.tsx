"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { ContactInfo } from "@/types/contact";

const STORAGE_KEY = "colour_seven_contact_info";

interface ContactInfoContextType {
  contactInfo: ContactInfo | null;
  loaded: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  updateContactInfo: (info: Partial<ContactInfo>) => Promise<void>;
}

const ContactInfoContext = createContext<ContactInfoContextType | undefined>(undefined);

export function ContactInfoProvider({ children }: { children: ReactNode }) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    try {
      const stored = typeof window === "undefined" ? null : window.localStorage.getItem(STORAGE_KEY);
      setContactInfo(stored ? JSON.parse(stored) as ContactInfo : null);
    } catch {
      setContactInfo(null);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  const updateContactInfo = useCallback(async (info: Partial<ContactInfo>) => {
    const now = new Date().toISOString();
    const next: ContactInfo = {
      id: contactInfo?.id || "local-contact-info",
      whatsapp_number: "",
      phone_number: "",
      email: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      social_media: {},
      business_hours: {},
      is_active: true,
      created_at: contactInfo?.created_at || now,
      updated_at: now,
      ...contactInfo,
      ...info,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setContactInfo(next);
    } catch {
      throw new Error("Could not save contact details in this browser");
    }
  }, [contactInfo]);

  return (
    <ContactInfoContext.Provider value={{ contactInfo, loaded, loading, refresh, updateContactInfo }}>
      {children}
    </ContactInfoContext.Provider>
  );
}

export function useContactInfo() {
  const context = useContext(ContactInfoContext);
  if (!context) throw new Error("useContactInfo must be used within a ContactInfoProvider");
  return context;
}