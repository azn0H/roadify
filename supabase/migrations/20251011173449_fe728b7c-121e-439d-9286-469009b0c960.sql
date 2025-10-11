-- Fix Critical Security Issues: Privilege Escalation and Data Exposure (Fixed Version)

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- 2. Create secure user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Update get_current_user_role to use new table and add search_path protection
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- 5. Migrate existing role data from profiles to user_roles (convert via text)
INSERT INTO public.user_roles (user_id, role)
SELECT id, (role::text)::app_role
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. RLS Policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Update profiles RLS policies to fix security issues

-- Drop the vulnerable "Users can update their own profile" policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create restricted update policy (users can update everything EXCEPT role)
CREATE POLICY "Users can update own profile excluding role"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Drop the public teacher exposure policy
DROP POLICY IF EXISTS "Allow read all teachers" ON public.profiles;

-- Create authenticated-only teacher viewing policy
CREATE POLICY "Authenticated users can view teachers"
ON public.profiles
FOR SELECT
USING (
  role = 'teacher'::user_role 
  AND auth.role() = 'authenticated'
);

-- 8. Update handle_new_user trigger to also populate user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Get role from metadata
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    user_role::user_role
  );
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role::app_role);
  
  RETURN NEW;
END;
$$;