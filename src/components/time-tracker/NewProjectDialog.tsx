
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BasicProjectInfo from "@/components/projects/form/BasicProjectInfo";
import { ProjectFormValues } from "@/components/projects/ProjectModel";

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
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a project name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // In a real app, this would be an API call to create the project
    // For demo purposes, we're creating a mock project with a random ID
    setTimeout(() => {
      const newProject = {
        id: Math.random().toString(36).substr(2, 9),
        name: formValues.name,
      };
      
      onProjectCreated(newProject);
      
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
      setIsSubmitting(false);
      setOpen(false);
    }, 500);
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
              description={formValues.description}
              onChange={handleChange}
            />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
