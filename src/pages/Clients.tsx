
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Client, ClientFormValues } from "@/components/clients/ClientModel";
import { useClients } from "@/components/clients/useClients";
import { ClientList } from "@/components/clients/ClientList";
import { ClientDialog } from "@/components/clients/ClientDialog";

const Clients = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const {
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    isSubmitting,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient
  } = useClients();

  const handleOpenDialog = (client: Client | null = null) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentClient(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (values: ClientFormValues) => {
    let success;
    
    if (currentClient) {
      success = await handleUpdateClient(currentClient.id, values);
    } else {
      success = await handleCreateClient(values);
    }
    
    if (success) {
      handleCloseDialog();
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
            <p className="text-muted-foreground mt-1">
              Manage your clients and their information
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <div className="flex items-center mb-4">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <ClientList 
          clients={filteredClients}
          isLoading={isLoading}
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
          onAddClient={() => handleOpenDialog()}
          onEditClient={(client) => handleOpenDialog(client)}
          onDeleteClient={handleDeleteClient}
        />
      </div>

      <ClientDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentClient={currentClient}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCloseDialog}
      />
    </MainLayout>
  );
};

export default Clients;
