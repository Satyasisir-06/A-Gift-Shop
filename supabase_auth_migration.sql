-- Run this in your Supabase SQL Editor

-- 1. Make the password column in your profile table optional (since Supabase Auth handles encryption now)
ALTER TABLE public.users ALTER COLUMN password DROP NOT NULL;

-- 2. Create the trigger function to copy data from auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'New Patron'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Attach the trigger to fire whenever a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
