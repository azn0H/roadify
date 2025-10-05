-- Step 1: Drop all policies that depend on get_current_user_role()
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Teachers and admins can update approval status" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can view student profiles for approval" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all course purchases" ON public.user_courses;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage sale codes" ON public.sale_codes;

-- Step 2: Drop and recreate the function as security definer
DROP FUNCTION IF EXISTS public.get_current_user_role() CASCADE;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role::text INTO user_role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Step 3: Recreate policies for profiles table
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (get_current_user_role() = 'admin');

CREATE POLICY "Teachers can view students"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  role = 'student'::user_role 
  AND get_current_user_role() IN ('teacher', 'admin')
);

CREATE POLICY "Teachers and admins can update approval status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  role = 'student'::user_role
  AND get_current_user_role() IN ('teacher', 'admin')
)
WITH CHECK (
  role = 'student'::user_role
  AND get_current_user_role() IN ('teacher', 'admin')
);

-- Step 4: Recreate policies for other tables
CREATE POLICY "Admins can manage courses"
ON public.courses
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all course purchases"
ON public.user_courses
FOR SELECT
TO authenticated
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage all lessons"
ON public.lessons
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage sale codes"
ON public.sale_codes
FOR ALL
TO authenticated
USING (get_current_user_role() = 'admin');