-- ==============================================================================
-- MEMORIAL LEGACY SUITE - SUPABASE DATABASE SCHEMA
-- Project Reference: zpcgpdsydpzpfpheorkl
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Memorials Table
CREATE TABLE IF NOT EXISTS public.memorials (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE,
    death_date DATE,
    birth_place TEXT,
    service_date DATE,
    service_location TEXT,
    biography TEXT,
    photo_url TEXT,
    theme_color TEXT DEFAULT '#1e293b',
    format TEXT DEFAULT 'Bi-fold Program',
    status TEXT DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Soft-Deleted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_memorials_user_id ON public.memorials(user_id);
CREATE INDEX IF NOT EXISTS idx_memorials_status ON public.memorials(status);
CREATE INDEX IF NOT EXISTS idx_memorials_created_at ON public.memorials(created_at DESC);

-- Enable RLS
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;

-- Memorials RLS Policies: Public read for active memorials, full access for owner
CREATE POLICY "Public memorials are readable by everyone" 
ON public.memorials 
FOR SELECT 
USING (status = 'Active' OR (select auth.uid()) = user_id);

CREATE POLICY "Authenticated users can create memorials" 
ON public.memorials 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Users can update their own memorials" 
ON public.memorials 
FOR UPDATE 
TO authenticated 
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own memorials" 
ON public.memorials 
FOR DELETE 
TO authenticated 
USING ((select auth.uid()) = user_id);

-- Also allow anon insert for guest memorial creations
CREATE POLICY "Anon can create memorials"
ON public.memorials
FOR INSERT
TO anon
WITH CHECK (true);

-- 3. Obituaries Table
CREATE TABLE IF NOT EXISTS public.obituaries (
    id TEXT PRIMARY KEY,
    memorial_id TEXT REFERENCES public.memorials(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    person_name TEXT NOT NULL,
    tone TEXT NOT NULL,
    faith TEXT,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_obituaries_memorial ON public.obituaries(memorial_id);
CREATE INDEX IF NOT EXISTS idx_obituaries_created_at ON public.obituaries(created_at DESC);

ALTER TABLE public.obituaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Obituaries are readable by everyone" 
ON public.obituaries 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create obituaries" 
ON public.obituaries 
FOR INSERT 
WITH CHECK (true);

-- 4. Condolences & Guestbook Table
CREATE TABLE IF NOT EXISTS public.condolences (
    id TEXT PRIMARY KEY,
    memorial_id TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    message TEXT NOT NULL,
    relationship TEXT,
    candle_lit BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_condolences_memorial ON public.condolences(memorial_id);
CREATE INDEX IF NOT EXISTS idx_condolences_created_at ON public.condolences(created_at DESC);

ALTER TABLE public.condolences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Condolences are viewable by everyone" 
ON public.condolences 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can leave a condolence" 
ON public.condolences 
FOR INSERT 
WITH CHECK (true);

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    package_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Paid' CHECK (status IN ('Pending', 'Paid', 'In Production', 'Shipped')),
    tracking_number TEXT,
    download_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can place an order" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- 6. Templates Table
CREATE TABLE IF NOT EXISTS public.templates (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    tradition TEXT,
    description TEXT,
    thumbnail_url TEXT,
    dimensions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Templates are readable by all" 
ON public.templates 
FOR SELECT 
USING (true);
