-- =====================================================
-- ADMIN SECURITY & RLS - COMPLETE FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- =====================================================

-- STEP 1: Drop ALL existing policies to start fresh
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    -- Drop all policies on mixtapes
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'mixtapes' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.mixtapes', pol.policyname);
    END LOOP;

    -- Drop all policies on portfolio
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'portfolio' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.portfolio', pol.policyname);
    END LOOP;

    -- Drop all policies on events
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'events' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.events', pol.policyname);
    END LOOP;

    -- Drop all policies on site_settings
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'site_settings' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_settings', pol.policyname);
    END LOOP;

    -- Drop all policies on bookings
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'bookings' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', pol.policyname);
    END LOOP;

    -- Drop all policies on profiles
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- STEP 2: Ensure Profiles table exists
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 3: Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mixtapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- STEP 4: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 5: Create/replace the is_admin() helper
-- This runs as SECURITY DEFINER so it bypasses RLS on profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;

-- =====================================================
-- STEP 6: Create NEW policies (clean slate)
-- =====================================================

-- ===== PROFILES =====
-- Everyone can read their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Admins can see all profiles
CREATE POLICY "profiles_select_admin"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- ===== MIXTAPES =====
-- Anyone can view public mixtapes
CREATE POLICY "mixtapes_select_public"
ON public.mixtapes FOR SELECT
USING (true);

-- Admins can insert mixtapes
CREATE POLICY "mixtapes_insert_admin"
ON public.mixtapes FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update mixtapes
CREATE POLICY "mixtapes_update_admin"
ON public.mixtapes FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete mixtapes
CREATE POLICY "mixtapes_delete_admin"
ON public.mixtapes FOR DELETE
USING (public.is_admin());

-- ===== EVENTS =====
-- Anyone can view events
CREATE POLICY "events_select_public"
ON public.events FOR SELECT
USING (true);

-- Admins can insert events
CREATE POLICY "events_insert_admin"
ON public.events FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update events
CREATE POLICY "events_update_admin"
ON public.events FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete events
CREATE POLICY "events_delete_admin"
ON public.events FOR DELETE
USING (public.is_admin());

-- ===== PORTFOLIO =====
-- Anyone can view portfolio
CREATE POLICY "portfolio_select_public"
ON public.portfolio FOR SELECT
USING (true);

-- Admins can insert portfolio items
CREATE POLICY "portfolio_insert_admin"
ON public.portfolio FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update portfolio items
CREATE POLICY "portfolio_update_admin"
ON public.portfolio FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete portfolio items
CREATE POLICY "portfolio_delete_admin"
ON public.portfolio FOR DELETE
USING (public.is_admin());

-- ===== BOOKINGS =====
-- Anyone can insert bookings (public form)
CREATE POLICY "bookings_insert_public"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Admins can view all bookings
CREATE POLICY "bookings_select_admin"
ON public.bookings FOR SELECT
USING (public.is_admin());

-- Admins can update bookings
CREATE POLICY "bookings_update_admin"
ON public.bookings FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete bookings
CREATE POLICY "bookings_delete_admin"
ON public.bookings FOR DELETE
USING (public.is_admin());

-- ===== SITE SETTINGS =====
-- Anyone can view settings
CREATE POLICY "settings_select_public"
ON public.site_settings FOR SELECT
USING (true);

-- Admins can insert settings
CREATE POLICY "settings_insert_admin"
ON public.site_settings FOR INSERT
WITH CHECK (public.is_admin());

-- Admins can update settings
CREATE POLICY "settings_update_admin"
ON public.site_settings FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admins can delete settings
CREATE POLICY "settings_delete_admin"
ON public.site_settings FOR DELETE
USING (public.is_admin());

-- =====================================================
-- STEP 7: VERIFY your admin status
-- Run this AFTER the script above to confirm everything works
-- =====================================================

-- Check your current user profile:
SELECT id, email, role FROM public.profiles WHERE id = auth.uid();

-- If the above returns role = 'user' or no rows, run this to upgrade:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';
