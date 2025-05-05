
import React from 'react';
import { TeamMember, UserRole } from "@/components/team/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/team/MultiSelect";
import { Project } from "@/components/projects/ProjectModel";

interface EditMemberFormProps {
  editedMember: TeamMember;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: string) => void;
  handleProjectsChange: (selectedProjects: string[]) => void;
  projects: Project[];
  isLoadingProjects: boolean;
}

const EditMemberForm: React.FC<EditMemberFormProps> = ({
  editedMember,
  handleInputChange,
  handleRoleChange,
  handleProjectsChange,
  projects,
  isLoadingProjects
}) => {
  return (
    <form className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Name</Label>
          <Input 
            id="edit-name" 
            value={editedMember.name}
            onChange={handleInputChange}
            className="bg-secondary/50 border-white/10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email">Email</Label>
          <Input 
            id="edit-email" 
            type="email" 
            value={editedMember.email}
            onChange={handleInputChange}
            className="bg-secondary/50 border-white/10" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-department">Department</Label>
          <Input 
            id="edit-department" 
            value={editedMember.department}
            onChange={handleInputChange}
            className="bg-secondary/50 border-white/10" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-role">Role</Label>
          <Select value={editedMember.role} onValueChange={handleRoleChange}>
            <SelectTrigger id="edit-role" className="bg-secondary/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border border-white/10">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="project_manager">Project Manager</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="member">Team Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2 pt-2">
        <Label htmlFor="edit-projects">Projects</Label>
        {isLoadingProjects ? (
          <div className="text-sm text-muted-foreground">Loading projects...</div>
        ) : (
          <MultiSelect
            options={projects}
            selectedValues={editedMember.projects}
            onChange={handleProjectsChange}
            placeholder="No projects assigned"
            className="bg-secondary/50 border-white/10"
          />
        )}
      </div>
    </form>
  );
};

export default EditMemberForm;
