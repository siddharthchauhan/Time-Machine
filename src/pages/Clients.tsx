import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Pencil, Trash, User, Mail, Phone, Wallet } from "lucide-react";
import { Client, ClientFormValues } from "@/components/clients/ClientModel";
import ClientForm from "@/components/clients/ClientForm";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const { supabase } = useAuth();

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name");

        if (error) throw error;

        // Map the response data to Client type
        const clientsData = data?.map(client => ({
          id: client.id,
          name: client.name,
          contact_name: client.contact_name,
          contact_email: client.contact_email,
          contact_phone: client.contact_phone,
          address: client.address,
          billing_rate: client.billing_rate,
          created_at: client.created_at,
          updated_at: client.updated_at
        })) || [];

        setClients(clientsData);
        setFilteredClients(clientsData);
      } catch (error: any) {
        toast({
          title: "Error fetching clients",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [supabase, toast]);

  // Filter clients when search term changes
  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleOpenDialog = (client: Client | null = null) => {
    setCurrentClient(client);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentClient(null);
    setIsDialogOpen(false);
  };

  const handleCreateClient = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from("clients")
        .insert({
          name: values.name,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          address: values.address,
          billing_rate: values.billingRate,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select("*")
        .single();

      if (error) throw error;

      // Convert the response data to Client type
      const newClient: Client = {
        id: data.id,
        name: data.name,
        contact_name: data.contact_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
        address: data.address,
        billing_rate: data.billing_rate,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setClients([...clients, newClient]);
      toast({
        title: "Client created",
        description: `${values.name} has been created successfully`,
      });
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error creating client",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (values: ClientFormValues) => {
    if (!currentClient) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("clients")
        .update({
          name: values.name,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          address: values.address,
          billing_rate: values.billingRate,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentClient.id)
        .select("*")
        .single();

      if (error) throw error;

      setClients(
        clients.map((client) =>
          client.id === currentClient.id ? (data as Client) : client
        )
      );

      toast({
        title: "Client updated",
        description: `${values.name} has been updated successfully`,
      });
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error updating client",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) throw error;

      setClients(clients.filter((client) => client.id !== clientId));
      toast({
        title: "Client deleted",
        description: "Client has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting client",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (values: ClientFormValues) => {
    if (currentClient) {
      await handleUpdateClient(values);
    } else {
      await handleCreateClient(values);
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader className="h-24 bg-muted rounded-t-lg"></CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-2 text-center">
                {searchTerm
                  ? "No clients found matching your search."
                  : "No clients found. Create your first client to get started!"}
              </p>
              {searchTerm ? (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              ) : (
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Client
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{client.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(client)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClient(client.id)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {client.billingRate
                      ? `Default rate: $${client.billingRate.toFixed(2)}/hr`
                      : "No default billing rate"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {client.contactName && (
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{client.contactName}</span>
                      </div>
                    )}
                    {client.contactEmail && (
                      <div className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{client.contactEmail}</span>
                      </div>
                    )}
                    {client.contactPhone && (
                      <div className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span>{client.contactPhone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentClient ? "Edit Client" : "Create New Client"}
            </DialogTitle>
          </DialogHeader>
          <ClientForm
            initialValues={
              currentClient
                ? {
                    name: currentClient.name,
                    contactName: currentClient.contactName,
                    contactEmail: currentClient.contactEmail,
                    contactPhone: currentClient.contactPhone,
                    address: currentClient.address,
                    billingRate: currentClient.billingRate,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Clients;
