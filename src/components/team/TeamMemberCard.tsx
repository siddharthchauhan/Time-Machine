
import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, TeamMember } from "@/components/team/types";
import { Project } from "@/components/projects/ProjectModel";
import { useToast } from "@/hooks/use-toast";

interface TeamMemberCardProps {
  member: TeamMember;
  isEditMode?: boolean;
  onDeleteMember?: (id: string) => void;
}

const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return <Badge className="bg-primary/90">Admin</Badge>;
    case 'project_manager':
      return <Badge variant="outline" className="border-purple-300/70 text-purple-300">Project Manager</Badge>;
    case 'manager':
      return <Badge variant="outline" className="border-primary/70 text-primary">Manager</Badge>;
    case 'member':
      return <Badge variant="outline" className="border-muted text-muted-foreground">Team Member</Badge>;
  }
};

const TeamMemberCard = ({ member, isEditMode = true, onDeleteMember }: TeamMemberCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [editedMember, setEditedMember] = useState<TeamMember>({...member});
  const [selectedProjects, setSelectedProjects] = useState<string[]>(member.projects || []);
  const { toast } = useToast();

  // Fetch projects when the dialog opens
  useEffect(() => {
    if (isDialogOpen) {
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
  }, [isDialogOpen]);

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
    // In a real application, this would save to the database/API
    console.log("Saving changes for team member:", editedMember);
    setIsDialogOpen(false);
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
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.avatar} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {member.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center">
              <h4 className="font-medium">{member.name}</h4>
              <div className="ml-2">{getRoleBadge(member.role)}</div>
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          <div className="mt-2 sm:mt-0">
            <p className="text-sm text-primary/90 font-medium">{member.department}</p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">
            Projects: {member.projects.join(', ')}
          </p>
        </div>
      </div>
      {isEditMode && (
        <div className="flex items-center gap-1 ml-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <Button type="button" variant="outline" className="border-white/10" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="ghost" className="text-destructive hover:bg-white/10">
                <Trash className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border border-white/10 shadow-xl">
              <DialogHeader>
                <DialogTitle>Delete Team Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove {member.name} from the team? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" className="border-white/10" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDeleteMember}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
