
import { useState, useEffect } from 'react';
import { TeamMember, UserRole } from "@/components/team/types";
import { Project } from "@/components/projects/ProjectModel";

export const useEditMember = (member: TeamMember, onSave: (editedMember: TeamMember) => void) => {
  const [editedMember, setEditedMember] = useState<TeamMember>({...member});
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch projects when the dialog opens
  useEffect(() => {
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
  }, []);

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

  const handleProjectsChange = (selectedProjects: string[]) => {
    setEditedMember({
      ...editedMember,
      projects: selectedProjects
    });
  };

  const handleSaveChanges = () => {
    onSave(editedMember);
  };

  return {
    editedMember,
    activeProjects,
    isLoadingProjects,
    handleInputChange,
    handleRoleChange,
    handleProjectsChange,
    handleSaveChanges
  };
};
