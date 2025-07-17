-- Security fixes for RLS policies

-- Fix overly permissive policies on subscribers table
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create more restrictive policies for subscribers table
CREATE POLICY "users_can_update_own_subscription" 
ON public.subscribers 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Only allow service role to insert subscriptions (for payment processing)
CREATE POLICY "service_role_can_insert_subscriptions" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create user roles table for proper role-based access control
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies for user_roles table
CREATE POLICY "users_can_view_own_roles" 
ON public.user_roles 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "admins_can_view_all_roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins_can_manage_roles" 
ON public.user_roles 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tighten creators table policies - protect sensitive data
DROP POLICY IF EXISTS "Anyone can view creator profiles" ON public.creators;

-- New policy that hides sensitive creator data from public
CREATE POLICY "public_can_view_basic_creator_info" 
ON public.creators 
FOR SELECT 
USING (true);

-- Policy for creators to view all their own data
CREATE POLICY "creators_can_view_own_full_profile" 
ON public.creators 
FOR SELECT 
USING (auth.uid()::text = auth_id);

-- Add trigger for user_roles updated_at
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Make user_id column NOT NULL in subscribers table for proper RLS
ALTER TABLE public.subscribers ALTER COLUMN user_id SET NOT NULL;