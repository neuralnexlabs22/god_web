-- GOD Store — E-Commerce & Admin Schema Enhancements
-- Production Migration Script for Supabase / PostgreSQL

-- 1. DISCOUNT COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.discount_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT,
    original_price NUMERIC NOT NULL CHECK (original_price > 0),
    desired_price NUMERIC NOT NULL CHECK (desired_price >= 0 AND desired_price <= original_price),
    discount_amount NUMERIC NOT NULL CHECK (discount_amount >= 0),
    discount_percentage NUMERIC NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    min_purchase_amount NUMERIC DEFAULT 0,
    scope TEXT NOT NULL DEFAULT 'order' CHECK (scope IN ('order', 'product')),
    target_product_id TEXT,
    usage_limit INTEGER,
    usage_limit_per_customer INTEGER,
    used_count INTEGER NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.discount_coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.discount_coupons (is_active);

-- 2. COUPON USAGES TABLE
CREATE TABLE IF NOT EXISTS public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES public.discount_coupons(id) ON DELETE SET NULL,
    coupon_code TEXT NOT NULL,
    order_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    original_amount NUMERIC NOT NULL,
    discount_amount NUMERIC NOT NULL,
    final_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON public.coupon_usages (coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_code ON public.coupon_usages (coupon_code);

-- 3. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    city TEXT,
    designation TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    image_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_verified_buyer BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_published ON public.customer_reviews (is_published, display_order);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT NOT NULL DEFAULT 'whatsapp',
    shipping_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- 5. SITE SETTINGS & CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CUSTOM DEVOTIONAL ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.custom_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    deity_artwork TEXT,
    dimensions TEXT,
    framing_preference TEXT,
    reference_image_url TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.custom_enquiries (status);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow public read on active coupons
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read active coupons') THEN
        CREATE POLICY "Public read active coupons" ON public.discount_coupons FOR SELECT USING (is_active = true);
    END IF;
END $$;

-- Allow public read on published customer reviews
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published reviews') THEN
        CREATE POLICY "Public read published reviews" ON public.customer_reviews FOR SELECT USING (is_published = true);
    END IF;
END $$;

-- Allow public read on site settings
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read site settings') THEN
        CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
    END IF;
END $$;

-- Allow public insert on customer reviews and custom enquiries
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert reviews') THEN
        CREATE POLICY "Public insert reviews" ON public.customer_reviews FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public insert enquiries') THEN
        CREATE POLICY "Public insert enquiries" ON public.custom_enquiries FOR INSERT WITH CHECK (true);
    END IF;
END $$;
