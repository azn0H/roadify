-- Allow admins and teachers to insert notifications
CREATE POLICY "Admins and teachers can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (
  get_current_user_role() IN ('admin', 'teacher')
);