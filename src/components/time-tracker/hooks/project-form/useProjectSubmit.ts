
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { ProjectFormValues } from "./types";

export const useProjectSubmit = (
  formValues: ProjectFormValues,
  setFormValues: (values: ProjectFormValues) => void,
  setIsSubmitting: (isSubmitting: boolean) => void,
  onProjectCreated: (project: { id: string; name: string }) => void,
  onClose: () => void
) => {
  const { toast } = useToast();
  const { profile, supabase } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.id) {
      toast({
        title: "Error creating project",
        description: "User profile not available. Please try refreshing your profile.",
        variant: "destructive",
      });
      console.error("User profile not available for project creation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating project with user ID:", profile.id);
      console.log("Project data:", { ...formValues, clientId: formValues.clientId || null });
      
      // Handle the mock guest user specially to avoid UUID errors
      if (profile.id === 'guest') {
        // For the guest user, we'll create a mock project with a generated ID
        const mockProjectId = crypto.randomUUID();
        
        // Create new project object
        const newProject = {
          id: mockProjectId,
          name: formValues.name,
          description: formValues.description || null,
          client_id: formValues.clientId || null,
          status: 'active',
          created_by: profile.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        // Get existing guest projects from localStorage or initialize empty array
        const existingProjects = localStorage.getItem('guestProjects') 
          ? JSON.parse(localStorage.getItem('guestProjects')!) 
          : [];
        
        // Add new project to localStorage
        localStorage.setItem('guestProjects', JSON.stringify([...existingProjects, newProject]));
        
        // Notify the parent component about the new project
        onProjectCreated({
          id: mockProjectId,
          name: formValues.name,
        });
        
        toast({
          title: "Project created",
          description: `${formValues.name} has been created successfully`,
        });
        
        // Reset form
        setFormValues({
          name: "",
          description: "",
          clientId: undefined,
          status: "active"
        });
        onClose();
        return;
      }
      
      // For real users, insert the project into the database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formValues.name,
          description: formValues.description || null,
          client_id: formValues.clientId || null,
          status: 'active',
          created_by: profile.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Notify the parent component about the new project
      onProjectCreated({
        id: data.id,
        name: data.name,
      });
      
      toast({
        title: "Project created",
        description: `${formValues.name} has been created successfully`,
      });
      
      // Reset form
      setFormValues({
        name: "",
        description: "",
        clientId: undefined,
        status: "active"
      });
      onClose();
    } catch (error: any) {
      console.error("Project creation error:", error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
