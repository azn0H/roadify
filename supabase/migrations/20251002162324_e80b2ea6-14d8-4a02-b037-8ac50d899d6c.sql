-- Add approval status and rejection reason to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS rejection_reason text,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Create index for faster queries on pending approvals
CREATE INDEX IF NOT EXISTS idx_profiles_approval_status ON public.profiles(approval_status) WHERE approval_status = 'pending';

-- Allow teachers and admins to view all profiles for approval purposes
CREATE POLICY "Teachers can view student profiles for approval"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher'
  AND role = 'student'
);

-- Allow teachers and admins to update approval status
CREATE POLICY "Teachers and admins can update approval status"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
  AND role = 'student'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'admin')
  AND role = 'student'
);

-- Teachers can view student documents for approval
CREATE POLICY "Teachers can view student documents for approval"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('teacher', 'admin')
  )
);