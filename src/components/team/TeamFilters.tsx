
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeamFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
  filterDepartment: string;
  setFilterDepartment: (department: string) => void;
  departments: string[];
}

const TeamFilters = ({
  searchTerm,
  setSearchTerm,
  filterRole,
  setFilterRole,
  filterDepartment,
  setFilterDepartment,
  departments
}: TeamFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1"
      />
      <Select
        value={filterDepartment}
        onValueChange={setFilterDepartment}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Departments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          {departments.map(dept => (
            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filterRole}
        onValueChange={setFilterRole}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="project_manager">Project Manager</SelectItem>
          <SelectItem value="member">Team Member</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TeamFilters;
