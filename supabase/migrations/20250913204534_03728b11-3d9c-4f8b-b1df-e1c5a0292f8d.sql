-- Create sale codes table for admin-generated discount codes
CREATE TABLE public.sale_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_limit INTEGER,
  times_used INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sale_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for sale codes
CREATE POLICY "Admins can manage sale codes" 
ON public.sale_codes 
FOR ALL 
USING (get_current_user_role() = 'admin'::text);

CREATE POLICY "Anyone can view active sale codes for validation" 
ON public.sale_codes 
FOR SELECT 
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Add sale code field to user_courses table
ALTER TABLE public.user_courses ADD COLUMN sale_code_used TEXT;

-- Create trigger for updating timestamps
CREATE TRIGGER update_sale_codes_updated_at
BEFORE UPDATE ON public.sale_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();