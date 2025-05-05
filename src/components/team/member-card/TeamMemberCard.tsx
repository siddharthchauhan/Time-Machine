
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { TeamMember } from "@/components/team/types";
import MemberInfo from "./MemberInfo";
import EditDialog from "./edit-dialog/EditDialog";
import DeleteDialog from "./DeleteDialog";

interface TeamMemberCardProps {
  member: TeamMember;
  isEditMode?: boolean;
  onDeleteMember?: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  isEditMode = true, 
  onDeleteMember 
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveChanges = (editedMember: TeamMember) => {
    // In a real application, this would save to the database/API
    console.log("Saving changes for team member:", editedMember);
    // Implement actual save functionality as needed
    toast({
      title: "Changes saved",
      description: `${editedMember.name}'s information has been updated`,
    });
  };

  const handleDeleteMember = () => {
    if (onDeleteMember) {
      onDeleteMember(member.id);
    }
    setIsDeleteDialogOpen(false);
    toast({
      title: "Team member deleted",
      description: `${member.name} has been removed from the team`,
      variant: "destructive",
    });
  };

  return (
    <div key={member.id} className="flex items-center p-4 rounded-lg border border-white/10 bg-card/50 backdrop-blur-sm hover:border-white/20 transition-all">
      <MemberInfo member={member} />
      
      {isEditMode && (
        <div className="flex items-center gap-1 ml-4">
          <EditDialog
            member={member}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleSaveChanges}
          />
          
          <DeleteDialog
            memberName={member.name}
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onDelete={handleDeleteMember}
          />
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
