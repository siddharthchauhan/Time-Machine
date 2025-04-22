
import MainLayout from "@/components/layout/MainLayout";
import ApprovalsList from "@/components/approvals/ApprovalsList";

const Approvals = () => {
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approval Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve time entries from your team members.
          </p>
        </div>
        
        <ApprovalsList />
      </div>
    </MainLayout>
  );
};

export default Approvals;
