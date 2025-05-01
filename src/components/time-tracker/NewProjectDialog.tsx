
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BasicProjectInfo from "@/components/projects/form/BasicProjectInfo";
import { ProjectFormValues } from "@/components/projects/ProjectModel";
import { useAuth } from "@/hooks/use-auth";

type NewProjectDialogProps = {
  onProjectCreated: (project: { id: string; name: string }) => void;
};

const NewProjectDialog = ({ onProjectCreated }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState<ProjectFormValues>({
    name: "",
    description: "",
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { supabase, profile, isReady } = useAuth();

  useEffect(() => {
    if (open) {
      setIsLoading(!isReady || !profile?.id);
    }
  }, [open, profile, isReady]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        description: "User profile not available. Please try refreshing the page.",
        variant: "destructive",
      });
      console.error("User profile not available for project creation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Insert the project into the database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formValues.name,
          description: formValues.description || null,
          status: 'active' as "active" | "completed" | "onHold" | "archived",
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
        status: "active"
      });
      setOpen(false);
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <BasicProjectInfo
              name={formValues.name}
              description={formValues.description || ""}
              onChange={handleChange}
            />
            {isLoading && (
              <div className="text-sm text-amber-500 bg-amber-50 p-3 rounded flex items-center justify-between">
                <span>Profile data not loaded yet. Please wait or refresh.</span>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="ml-2 h-7"
                >
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                  Refresh
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
