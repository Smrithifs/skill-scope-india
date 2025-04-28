
-- Create a function to increment a column value
CREATE OR REPLACE FUNCTION increment_applications_count(internship_id uuid)
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE public.internships
  SET applications_count = COALESCE(applications_count, 0) + 1
  WHERE id = internship_id;
$$;
