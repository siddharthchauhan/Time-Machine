
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BasicProjectInfo from "@/components/projects/form/BasicProjectInfo";
import { ProjectFormValues } from "@/components/projects/ProjectModel";
import { useAuth } from "@/hooks/use-auth";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { toast } = useToast();
  const { supabase, profile, isReady, loadError, forceRefreshProfile } = useAuth();

  // Check profile status when dialog opens
  useEffect(() => {
    if (open) {
      if (!profile?.id) {
        setIsRefreshing(true);
        forceRefreshProfile().then(refreshedProfile => {
          setIsRefreshing(false);
          if (!refreshedProfile) {
            setProfileError("Unable to load profile. Please refresh and try again.");
          } else {
            setProfileError(null);
          }
        }).catch(error => {
          setIsRefreshing(false);
          setProfileError("Error refreshing profile: " + (error.message || "Unknown error"));
        });
      } else {
        setProfileError(null);
      }
    }
  }, [open, profile, forceRefreshProfile]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await forceRefreshProfile();
      if (success) {
        setProfileError(null);
        toast({
          title: "Profile refreshed",
          description: "Your profile has been successfully loaded.",
        });
      } else {
        toast({
          title: "Profile refresh failed",
          description: "Could not load your profile data. Please try signing out and back in.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Profile refresh error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
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
        description: "User profile not available. Please try refreshing your profile.",
        variant: "destructive",
      });
      console.error("User profile not available for project creation");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating project with user ID:", profile.id);
      
      // Insert the project into the database
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: formValues.name,
          description: formValues.description || null,
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
            {profileError && (
              <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                <AlertTitle className="text-amber-600">Unable to load profile</AlertTitle>
                <div className="flex items-center justify-between">
                  <AlertDescription className="text-amber-600">
                    {profileError}
                  </AlertDescription>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh}
                    className="ml-2 h-7"
                    disabled={isRefreshing}
                  >
                    <RefreshCcw className={`h-3.5 w-3.5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting || isRefreshing}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !!profileError || isRefreshing}
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
