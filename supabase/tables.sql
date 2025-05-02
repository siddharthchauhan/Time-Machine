
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
