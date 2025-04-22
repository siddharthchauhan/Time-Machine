
import MainLayout from "@/components/layout/MainLayout";
import SettingsForm from "@/components/settings/SettingsForm";

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        
        <SettingsForm />
      </div>
    </MainLayout>
  );
};

export default Settings;
