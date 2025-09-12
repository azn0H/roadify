-- Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public) VALUES ('student-documents', 'student-documents', false);

-- Create policies for document uploads
CREATE POLICY "Students can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all student documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'student-documents' AND (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Add document status fields to user_courses table
ALTER TABLE public.user_courses 
ADD COLUMN documents_uploaded BOOLEAN DEFAULT FALSE,
ADD COLUMN instructor_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN onboarding_step INTEGER DEFAULT 1;