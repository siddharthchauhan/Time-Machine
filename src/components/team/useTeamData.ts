
import { useState } from "react";
import { TeamMember, NewTeamMember } from "./types";
import { useToast } from "@/hooks/use-toast";

// Initial team members data
const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    role: 'admin',
    department: 'Engineering',
    projects: ['Website Redesign', 'Mobile App']
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    role: 'manager',
    department: 'Design',
    projects: ['Website Redesign', 'Mobile App', 'CRM Integration']
  },
  {
    id: '3',
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    role: 'member',
    department: 'Engineering',
    projects: ['CRM Integration', 'Mobile App']
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma.d@example.com',
    role: 'member',
    department: 'Marketing',
    projects: ['Website Redesign']
  },
  {
    id: '5',
    name: 'Robert Chen',
    email: 'robert.c@example.com',
    role: 'manager',
    department: 'Engineering',
    projects: ['CRM Integration']
  }
];

export const useTeamData = () => {
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const { toast } = useToast();
  
  // Form state for new member
  const [newMember, setNewMember] = useState<NewTeamMember>({
    name: '',
    email: '',
    department: '',
    role: 'member',
    projects: []
  });
  
  // Get unique departments for filter
  const departments = Array.from(new Set(members.map(member => member.department)));
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.target;
    const fieldName = name || id;
    
    setNewMember({
      ...newMember,
      [fieldName]: value
    });
  };
  
  const handleSelectChange = (field: string, value: string) => {
    if (field === 'projects') {
      setNewMember({
        ...newMember,
        [field]: [value]
      });
    } else {
      setNewMember({
        ...newMember,
        [field]: value
      });
    }
  };
  
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new team member
    const newTeamMember: TeamMember = {
      id: `${members.length + 1}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      department: newMember.department,
      projects: newMember.projects
    };
    
    // Update state with new member
    setMembers([...members, newTeamMember]);
    
    // Show success toast
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added successfully`,
    });
    
    // Reset form
    setNewMember({
      name: '',
      email: '',
      department: '',
      role: 'member',
      projects: []
    });
  };

  return {
    members,
    newMember,
    departments,
    handleInputChange,
    handleSelectChange,
    handleAddUser,
    setNewMember,
    setMembers
  };
};
