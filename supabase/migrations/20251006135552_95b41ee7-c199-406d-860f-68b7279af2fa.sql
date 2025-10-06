-- Create missing profile for existing user
INSERT INTO public.profiles (id, email, first_name, last_name, role)
VALUES (
  '57f02376-dd0d-49b9-82a0-c5bc515a0767',
  'honzik.psencik@seznam.cz',
  'Jan',
  'Pšenčík',
  'student'
)
ON CONFLICT (id) DO NOTHING;

-- Verify the trigger exists and recreate it if needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();