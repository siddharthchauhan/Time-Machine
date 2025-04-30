
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeamMemberCard from "./TeamMemberCard";
import TeamFilters from "./TeamFilters";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import { TeamMember, UserRole, NewTeamMember } from "./types";
import TeamDashboard from "./TeamDashboard";
import { useAuth } from "@/components/auth/AuthProvider";

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

const TeamList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(initialTeamMembers);
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const isProjectManager = profile?.role === 'project_manager' || profile?.role === 'admin';
  
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
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewMember({
      ...newMember,
      [id.replace('new-', '')]: value
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
    
    // Reset form and close dialog
    setNewMember({
      name: '',
      email: '',
      department: '',
      role: 'member',
      projects: []
    });
    
    setShowAddDialog(false);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage your team members and their permissions
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isProjectManager ? "dashboard" : "all"} className="mb-6">
            <TabsList className="grid grid-cols-5">
              {isProjectManager && <TabsTrigger value="dashboard">Dashboard</TabsTrigger>}
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
              <TabsTrigger value="manager">Managers</TabsTrigger>
              <TabsTrigger value="member">Team Members</TabsTrigger>
            </TabsList>
            
            {isProjectManager && (
              <TabsContent value="dashboard">
                <div className="mt-4">
                  <TeamDashboard members={members} />
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="all">
              <div className="mt-4">
                <TeamFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterRole={filterRole}
                  setFilterRole={setFilterRole}
                  filterDepartment={filterDepartment}
                  setFilterDepartment={setFilterDepartment}
                  departments={departments}
                />
                
                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No team members found matching your filters.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {(['admin', 'manager', 'member'] as UserRole[]).map(role => (
              <TabsContent key={role} value={role}>
                <div className="space-y-4 mt-4">
                  {members.filter(member => member.role === role).map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} team members
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <AddTeamMemberDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        departments={departments}
        newMember={newMember}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleAddUser={handleAddUser}
      />
    </>
  );
};

export default TeamList;
