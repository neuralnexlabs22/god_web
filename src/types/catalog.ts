export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  description: string;
  website?: string;
  display_order: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}