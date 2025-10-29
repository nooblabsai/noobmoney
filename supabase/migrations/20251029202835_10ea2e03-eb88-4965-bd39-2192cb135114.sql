-- Fix search path for the update function
DROP TRIGGER IF EXISTS update_user_data_updated_at ON public.user_data;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();