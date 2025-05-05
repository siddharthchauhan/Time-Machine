
import React, { useState } from "react";
import { TeamMember, UserRole } from "./types";
import TeamMemberCard from "./TeamMemberCard";
import TeamFilters from "./TeamFilters";
import { useToast } from "@/hooks/use-toast";

interface TeamTabContentProps {
  members: TeamMember[];
  filterRole: string;
  onDeleteMember?: (id: string) => void;
}

const TeamTabContent = ({ members, filterRole, onDeleteMember }: TeamTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilterRole, setLocalFilterRole] = useState(filterRole);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const { toast } = useToast();
  
  // Get unique departments for filter
  const departments = Array.from(new Set(members.map(member => member.department)));
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = localFilterRole === 'all' || member.role === localFilterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleDeleteMember = (id: string) => {
    if (onDeleteMember) {
      onDeleteMember(id);
    }
  };
  
  return (
    <div className="mt-4">
      <TeamFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterRole={localFilterRole}
        setFilterRole={setLocalFilterRole}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        departments={departments}
      />
      
      <div className="space-y-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <TeamMemberCard 
              key={member.id} 
              member={member} 
              onDeleteMember={handleDeleteMember}
            />
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No team members found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamTabContent;
