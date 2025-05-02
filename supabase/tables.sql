
-- Create the projects table (this is for reference, it will be run separately)
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES public.clients(id),
  start_date DATE,
  end_date DATE,
  budget_hours NUMERIC,
  budget_amount NUMERIC,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Add RLS to the projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all projects
CREATE POLICY "Allow authenticated users to view projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to create projects
CREATE POLICY "Allow authenticated users to create projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to update projects
CREATE POLICY "Allow authenticated users to update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to delete projects
CREATE POLICY "Allow authenticated users to delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create the tasks table (required for project creation flow)
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_id UUID REFERENCES public.projects(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to the tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows authenticated users to view all tasks
CREATE POLICY "Allow authenticated users to view tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to create tasks
CREATE POLICY "Allow authenticated users to create tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy that allows authenticated users to update tasks
CREATE POLICY "Allow authenticated users to update tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policy that allows authenticated users to delete tasks
CREATE POLICY "Allow authenticated users to delete tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (true);

-- Create user_role type if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
  END IF;
END$$;

-- Create the profiles table if not exists
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'employee'::user_role,
  avatar_url TEXT,
  department_id UUID,
  manager_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS to profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create profile creation trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'employee'::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
