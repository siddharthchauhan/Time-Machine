
import MainLayout from "@/components/layout/MainLayout";
import TimeEntryForm from "@/components/time-tracker/TimeEntryForm";
import TimeEntriesList from "@/components/time-tracker/TimeEntriesList";

const TimeTracker = () => {
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time Tracker</h1>
          <p className="text-muted-foreground mt-1">
            Record and manage your time entries for projects and tasks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TimeEntryForm />
          </div>
          <div className="lg:col-span-2">
            <TimeEntriesList />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TimeTracker;
