
import React from 'react';
import { TeamMember } from "@/components/team/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditMemberForm from "./EditMemberForm";
import { useEditMember } from "./useEditMember";

interface EditDialogProps {
  member: TeamMember;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (editedMember: TeamMember) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ 
  member, 
  isOpen, 
  onOpenChange, 
  onSave 
}) => {
  const {
    editedMember,
    activeProjects,
    isLoadingProjects,
    handleInputChange,
    handleRoleChange,
    handleProjectsChange,
    handleSaveChanges
  } = useEditMember(member, onSave);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="hover:bg-white/10">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border border-white/10 shadow-xl">
        <DialogHeader>
          <DialogTitle>Edit Team Member</DialogTitle>
          <DialogDescription>
            Update information for {member.name}
          </DialogDescription>
        </DialogHeader>
        
        <EditMemberForm 
          editedMember={editedMember}
          handleInputChange={handleInputChange}
          handleRoleChange={handleRoleChange}
          handleProjectsChange={handleProjectsChange}
          projects={activeProjects}
          isLoadingProjects={isLoadingProjects}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" className="border-white/10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={() => {
            handleSaveChanges();
            onOpenChange(false);
          }}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
