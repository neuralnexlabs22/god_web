-- GOD Store — Secure Razorpay Payment Gateway Migration
-- Production Migration Script for Supabase / PostgreSQL

-- 1. ENHANCE ORDERS TABLE WITH RAZORPAY & FULFILLMENT FIELDS
ALTER TABLE public.orders 
    ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR',
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC,
    ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS customer_name TEXT,
    ADD COLUMN IF NOT EXISTS customer_phone TEXT,
    ADD COLUMN IF NOT EXISTS customer_email TEXT,
    ADD COLUMN IF NOT EXISTS items JSONB;

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_fulfillment_status ON public.orders (fulfillment_status);

-- 2. DEDICATED PAYMENT TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internal_order_id TEXT NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL CHECK (status IN ('authorized', 'captured', 'failed', 'refunded', 'partially_refunded')),
    payment_method TEXT,
    captured_at TIMESTAMPTZ,
    error_code TEXT,
    error_description TEXT,
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_records_order ON public.payment_records (internal_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_rzp_order ON public.payment_records (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON public.payment_records (status);

-- 3. WEBHOOK DEDUPLICATION TABLE
CREATE TABLE IF NOT EXISTS public.razorpay_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    order_id TEXT,
    payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'processed' CHECK (status IN ('received', 'processed', 'ignored', 'failed')),
    signature_verified BOOLEAN NOT NULL DEFAULT true,
    payload JSONB,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_webhook_event_id ON public.razorpay_webhook_events (event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_event_type ON public.razorpay_webhook_events (event_type);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_webhook_events ENABLE ROW LEVEL SECURITY;

-- Allow only server / service role to insert or update payment records & webhook logs
-- (No public user can ever write or modify financial transaction records)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access payments') THEN
        CREATE POLICY "Service role full access payments" ON public.payment_records 
            FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role full access webhooks') THEN
        CREATE POLICY "Service role full access webhooks" ON public.razorpay_webhook_events 
            FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
    END IF;
END $$;

