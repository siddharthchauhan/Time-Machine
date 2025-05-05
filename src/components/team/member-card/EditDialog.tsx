
import React, { useEffect, useState } from 'react';
import { TeamMember, UserRole } from "@/components/team/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/components/projects/ProjectModel";
import { Edit } from "lucide-react";

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
  const [editedMember, setEditedMember] = useState<TeamMember>({...member});
  const [selectedProjects, setSelectedProjects] = useState<string[]>(member.projects || []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
          // Check for guest user first (using localStorage)
          const storedProjects = localStorage.getItem('guestProjects');
          if (storedProjects) {
            const parsedProjects = JSON.parse(storedProjects);
            setProjects(parsedProjects.map((project: any) => ({
              id: project.id,
              name: project.name,
              status: project.status === 'active' || project.status === 'completed' || 
                     project.status === 'onHold' || project.status === 'archived' 
                     ? project.status 
                     : 'active',
              created_at: project.created_at || new Date().toISOString(),
              updated_at: project.updated_at || new Date().toISOString()
            })));
          } else {
            // For simplicity, use the same projects as in TeamList initial data
            const defaultProjects: Project[] = [
              {
                id: '1',
                name: 'Website Redesign',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: '2',
                name: 'Mobile App',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: '3',
                name: 'CRM Integration',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ];
            setProjects(defaultProjects);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      };

      fetchProjects();
    }
  }, [isOpen]);

  // Filter projects to show only active ones
  const activeProjects = projects.filter(project => project.status === 'active');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const fieldName = id.replace('edit-', '');
    setEditedMember({
      ...editedMember,
      [fieldName]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setEditedMember({
      ...editedMember,
      role: value as UserRole
    });
  };

  const handleProjectsChange = (selectedValues: string[]) => {
    setSelectedProjects(selectedValues);
    setEditedMember({
      ...editedMember,
      projects: selectedValues
    });
  };

  const handleSaveChanges = () => {
    onSave(editedMember);
    onOpenChange(false);
  };

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
              <div className="bg-secondary/50 border border-white/10 rounded-md">
                <Select>
                  <SelectTrigger className="w-full bg-secondary/50 border-0">
                    <SelectValue placeholder="Assign to projects" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-white/10">
                    {activeProjects.map(project => (
                      <SelectItem key={project.id} value={project.name}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="p-2 flex flex-wrap gap-1">
                  {selectedProjects.map(project => (
                    <Badge 
                      key={project} 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      {project}
                      <button 
                        className="ml-1 text-xs rounded-full hover:bg-primary/20 h-4 w-4 inline-flex items-center justify-center"
                        onClick={() => handleProjectsChange(selectedProjects.filter(p => p !== project))}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedProjects.length === 0 && (
                    <div className="text-xs text-muted-foreground">No projects assigned</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" className="border-white/10" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
