
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import BasicProjectInfo from "@/components/projects/form/BasicProjectInfo";
import { useProjectForm } from "./hooks/useProjectForm";
import ProfileErrorAlert from "./ProfileErrorAlert";

type NewProjectDialogProps = {
  onProjectCreated: (project: { id: string; name: string }) => void;
};

const NewProjectDialog = ({ onProjectCreated }: NewProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  
  const {
    formValues,
    isSubmitting,
    isRefreshing,
    profileError,
    handleChange,
    handleSubmit,
    handleRefresh
  } = useProjectForm({ 
    onProjectCreated: (project) => {
      onProjectCreated(project);
      setOpen(false);
    }, 
    onClose: () => setOpen(false) 
  });

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
              <ProfileErrorAlert 
                errorMessage={profileError}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />
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
