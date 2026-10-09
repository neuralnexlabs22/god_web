export interface ContactInfo {
  id: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  social_media: Record<string, unknown>;
  business_hours: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}