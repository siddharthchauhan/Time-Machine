
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import AddTeamMemberDialog from "./AddTeamMemberDialog";
import { UserRole } from "./types";
import TeamDashboard from "./TeamDashboard";
import { useAuth } from "@/components/auth/AuthProvider";
import { useTeamData } from "./useTeamData";
import TeamTabContent from "./TeamTabContent";
import TeamMemberCard from "./TeamMemberCard";

const TeamList = () => {
  const [filterRole, setFilterRole] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { profile } = useAuth();
  
  const {
    members,
    newMember,
    departments,
    handleInputChange,
    handleSelectChange,
    handleAddUser,
    setNewMember
  } = useTeamData();
  
  const isProjectManager = profile?.role === 'project_manager' || profile?.role === 'admin';

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
              <TeamTabContent members={members} filterRole="all" />
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
              Showing {members.filter(member => 
                filterRole === 'all' ? true : member.role === filterRole
              ).length} of {members.length} team members
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
