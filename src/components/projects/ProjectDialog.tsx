
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project, ProjectFormValues } from "./ProjectModel";
import ProjectForm from "./ProjectForm";

interface ProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentProject: Project | null;
  isSubmitting: boolean;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ProjectDialog({
  isOpen,
  onOpenChange,
  currentProject,
  isSubmitting,
  onSubmit,
  onCancel
}: ProjectDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {currentProject ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>
        <ProjectForm
          initialValues={
            currentProject
              ? {
                  name: currentProject.name,
                  description: currentProject.description,
                  clientId: currentProject.client_id,
                  startDate: currentProject.start_date,
                  endDate: currentProject.end_date,
                  budgetHours: currentProject.budget_hours,
                  budgetAmount: currentProject.budget_amount,
                  status: currentProject.status,
                }
              : undefined
          }
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
