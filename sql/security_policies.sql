-- Enable Row Level Security for all tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to check API key permissions
CREATE OR REPLACE FUNCTION auth.check_api_key_permissions(
  required_permission text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  api_key_role text;
BEGIN
  -- Get the role associated with the current API key
  api_key_role := current_setting('request.jwt.claims', true)::json->>'role';
  
  -- Check if the role has the required permission
  RETURN EXISTS (
    SELECT 1
    FROM auth.api_key_permissions
    WHERE role = api_key_role
    AND permission = required_permission
  );
END;
$$;

-- Create basic policies for the users table
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (
    auth.uid() = id
    OR auth.check_api_key_permissions('users:read')
  );

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (
    auth.uid() = id
    OR auth.check_api_key_permissions('users:write')
  );

-- Create policies for sensitive data masking
CREATE POLICY "Mask sensitive data for non-admins"
  ON public.users
  FOR SELECT
  USING (
    CASE
      WHEN auth.check_api_key_permissions('admin')
      THEN true
      ELSE (
        -- Mask sensitive fields for non-admin users
        email = NULL,
        phone = NULL,
        -- Add other sensitive fields here
        true
      )
    END
  );

-- Create default deny policy
CREATE POLICY "Default deny"
  ON public.users
  FOR ALL
  USING (false);

-- Create function to automatically mask sensitive data
CREATE OR REPLACE FUNCTION public.mask_sensitive_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT auth.check_api_key_permissions('admin') THEN
    -- Mask sensitive fields
    IF TG_OP = 'SELECT' THEN
      NEW.email := CASE 
        WHEN NEW.email IS NOT NULL 
        THEN '****' || RIGHT(NEW.email, POSITION('@' IN NEW.email))
        ELSE NULL 
      END;
      
      NEW.phone := CASE 
        WHEN NEW.phone IS NOT NULL 
        THEN '****' || RIGHT(NEW.phone, 4)
        ELSE NULL 
      END;
      
      -- Add other sensitive fields here
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic data masking
CREATE TRIGGER mask_sensitive_data_trigger
  BEFORE SELECT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.mask_sensitive_data();