import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import TeamList from "@/components/team/TeamList";
import DepartmentManagement from "@/components/team/DepartmentManagement";
import OrgStructureManagement from "@/components/team/OrgStructureManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const Team = () => {
  const [activeTab, setActiveTab] = useState("team");
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';
  
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage your team members and their permissions.
          </p>
        </div>
        
        {isAdmin && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="organization">Organization Structure</TabsTrigger>
            </TabsList>
            <TabsContent value="team" className="space-y-4">
              <TeamList />
            </TabsContent>
            <TabsContent value="departments" className="space-y-4">
              <DepartmentManagement />
            </TabsContent>
            <TabsContent value="organization" className="space-y-4">
              <OrgStructureManagement />
            </TabsContent>
          </Tabs>
        )}
        
        {!isAdmin && <TeamList />}
      </div>
    </MainLayout>
  );
};

export default Team;
