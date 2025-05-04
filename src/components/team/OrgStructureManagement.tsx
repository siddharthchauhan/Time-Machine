
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Network, Users, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Department {
  id: string;
  name: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department_id: string | null;
  department_name: string | null;
  manager_id: string | null;
  manager_name: string | null;
}

const OrgStructureManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<TeamMember[]>([]);
  const { toast } = useToast();
  const { profile } = useAuth();
  
  // Only admins should be able to manage the org structure
  const isAdmin = profile?.role === 'admin';
  
  useEffect(() => {
    fetchTeamData();
  }, []);
  
  const fetchTeamData = async () => {
    setIsLoading(true);
    try {
      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');
        
      if (departmentsError) throw departmentsError;
      setDepartments(departmentsData || []);
      
      // Fetch team members with department and manager info
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select(`
          id, 
          full_name, 
          email, 
          role, 
          department_id,
          manager_id
        `)
        .order('full_name');
        
      if (membersError) throw membersError;
      
      // Prepare data with department and manager names
      const enhancedMembers = await Promise.all((membersData || []).map(async (member) => {
        let departmentName = null;
        let managerName = null;
        
        if (member.department_id) {
          const { data } = await supabase
            .from('departments')
            .select('name')
            .eq('id', member.department_id)
            .single();
          departmentName = data?.name || null;
        }
        
        if (member.manager_id) {
          const { data } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', member.manager_id)
            .single();
          managerName = data?.full_name || null;
        }
        
        return {
          ...member,
          department_name: departmentName,
          manager_name: managerName
        };
      }));
      
      setTeamMembers(enhancedMembers);
      
      // Set potential managers (admins, project managers)
      const potentialManagers = enhancedMembers.filter(
        member => member.role === 'admin' || member.role === 'project_manager'
      );
      setManagers(potentialManagers);
      
    } catch (error: any) {
      toast({
        title: "Error fetching team data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateDepartment = async (userId: string, departmentId: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ department_id: departmentId })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => 
        prev.map(member => {
          if (member.id === userId) {
            const departmentName = departments.find(d => d.id === departmentId)?.name || null;
            return { ...member, department_id: departmentId, department_name: departmentName };
          }
          return member;
        })
      );
      
      toast({
        title: "Department updated",
        description: "Team member's department has been updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating department",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const updateManager = async (userId: string, managerId: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ manager_id: managerId })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setTeamMembers(prev => 
        prev.map(member => {
          if (member.id === userId) {
            const managerName = managers.find(m => m.id === managerId)?.full_name || null;
            return { ...member, manager_id: managerId, manager_name: managerName };
          }
          return member;
        })
      );
      
      toast({
        title: "Manager updated",
        description: "Team member's manager has been updated."
      });
    } catch (error: any) {
      toast({
        title: "Error updating manager",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Organization Structure
            </CardTitle>
            <CardDescription>
              Manage reporting relationships and departments for your team.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={fetchTeamData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : teamMembers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.full_name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{member.role}</span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.department_id || ""}
                      onValueChange={(value) => updateDepartment(member.id, value || null)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.manager_id || ""}
                      onValueChange={(value) => updateManager(member.id, value || null)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {managers
                          .filter(manager => manager.id !== member.id) // Can't be own manager
                          .map((manager) => (
                            <SelectItem key={manager.id} value={manager.id}>
                              {manager.full_name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No team members found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrgStructureManagement;
