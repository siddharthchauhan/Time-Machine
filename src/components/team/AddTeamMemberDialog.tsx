
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, NewTeamMember } from "@/components/team/types";
import { Project } from "@/components/projects/ProjectModel";

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  newMember: NewTeamMember;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleAddUser: (e: React.FormEvent) => void;
}

const AddTeamMemberDialog = ({
  open,
  onOpenChange,
  departments,
  newMember,
  handleInputChange,
  handleSelectChange,
  handleAddUser
}: AddTeamMemberDialogProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects when the dialog opens
  useEffect(() => {
    if (open) {
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
              status: project.status,
              created_at: project.created_at || new Date().toISOString(),
              updated_at: project.updated_at || new Date().toISOString()
            })));
          } else {
            // For simplicity, use the same projects as in TeamList initial data
            // In a real app, this would come from the API or Supabase
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
  }, [open]);

  // Filter projects to show only active ones
  const activeProjects = projects.filter(project => project.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new team member
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAddUser} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="Full name" 
                value={newMember.name}
                onChange={handleInputChange}
                name="name"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Email address" 
                value={newMember.email}
                onChange={handleInputChange}
                name="email"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={newMember.department} 
                onValueChange={(value) => handleSelectChange('department', value)}
                required
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newMember.role} 
                onValueChange={(value) => handleSelectChange('role', value as UserRole)}
                required
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="project_manager">Project Manager</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="pt-4">
            <Label htmlFor="projects">Projects</Label>
            <Select 
              value={newMember.projects[0] || ""} 
              onValueChange={(value) => handleSelectChange('projects', value)}
            >
              <SelectTrigger id="projects">
                <SelectValue placeholder="Assign to projects" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingProjects ? (
                  <SelectItem value="loading" disabled>Loading projects...</SelectItem>
                ) : activeProjects.length > 0 ? (
                  activeProjects.map(project => (
                    <SelectItem key={project.id} value={project.name}>{project.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No active projects found</SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">You can assign more projects later</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Team Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamMemberDialog;
