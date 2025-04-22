
import MainLayout from "@/components/layout/MainLayout";
import TeamList from "@/components/team/TeamList";

const Team = () => {
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Add, edit, and manage your team members and their permissions.
          </p>
        </div>
        
        <TeamList />
      </div>
    </MainLayout>
  );
};

export default Team;
