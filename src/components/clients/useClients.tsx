
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Client, ClientFormValues } from "./ClientModel";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { supabase, profile } = useAuth();

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients when search term changes
  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      
      // For guest user, use localStorage
      if (profile?.id === 'guest') {
        const storedClients = localStorage.getItem('guestClients');
        if (storedClients) {
          const parsedClients = JSON.parse(storedClients);
          setClients(parsedClients);
          setFilteredClients(parsedClients);
        } else {
          setClients([]);
          setFilteredClients([]);
        }
        setIsLoading(false);
        return;
      }
      
      // For real users, fetch from database
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) throw error;
      setClients(data || []);
      setFilteredClients(data || []);
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

  const handleCreateClient = async (values: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date().toISOString();
      
      // For guest user, store in localStorage
      if (profile?.id === 'guest') {
        const newClient = {
          id: crypto.randomUUID(),
          name: values.name,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          address: values.address,
          billing_rate: values.billingRate,
          created_at: timestamp,
          updated_at: timestamp,
        };
        
        // Get existing clients or initialize empty array
        const existingClients = localStorage.getItem('guestClients')
          ? JSON.parse(localStorage.getItem('guestClients')!)
          : [];
          
        // Add new client and save to localStorage
        const updatedClients = [...existingClients, newClient];
        localStorage.setItem('guestClients', JSON.stringify(updatedClients));
        
        // Update state
        setClients(updatedClients);
        
        toast({
          title: "Client created",
          description: `${values.name} has been created successfully`,
        });
        return true;
      }
      
      // For real users, insert into database
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

      setClients([...clients, data as Client]);
      toast({
        title: "Client created",
        description: `${values.name} has been created successfully`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error creating client",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClient = async (clientId: string, values: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // For guest user, update in localStorage
      if (profile?.id === 'guest') {
        // Get existing clients
        const existingClients = localStorage.getItem('guestClients')
          ? JSON.parse(localStorage.getItem('guestClients')!)
          : [];
          
        // Find and update the client
        const updatedClients = existingClients.map((client: Client) => 
          client.id === clientId 
            ? {
                ...client,
                name: values.name,
                contact_name: values.contactName,
                contact_email: values.contactEmail,
                contact_phone: values.contactPhone,
                address: values.address,
                billing_rate: values.billingRate,
                updated_at: new Date().toISOString(),
              } 
            : client
        );
        
        // Save to localStorage
        localStorage.setItem('guestClients', JSON.stringify(updatedClients));
        
        // Update state
        setClients(updatedClients);
        
        toast({
          title: "Client updated",
          description: `${values.name} has been updated successfully`,
        });
        return true;
      }
      
      // For real users, update in database
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
        .eq("id", clientId)
        .select("*")
        .single();

      if (error) throw error;

      setClients(
        clients.map((client) =>
          client.id === clientId ? (data as Client) : client
        )
      );

      toast({
        title: "Client updated",
        description: `${values.name} has been updated successfully`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating client",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return false;

    try {
      // For guest user, delete from localStorage
      if (profile?.id === 'guest') {
        // Get existing clients
        const existingClients = localStorage.getItem('guestClients')
          ? JSON.parse(localStorage.getItem('guestClients')!)
          : [];
          
        // Filter out the deleted client
        const updatedClients = existingClients.filter((client: Client) => client.id !== clientId);
        
        // Save to localStorage
        localStorage.setItem('guestClients', JSON.stringify(updatedClients));
        
        // Update state
        setClients(updatedClients);
        
        toast({
          title: "Client deleted",
          description: "Client has been deleted successfully",
        });
        return true;
      }
      
      // For real users, delete from database
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
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting client",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    clients,
    filteredClients,
    searchTerm,
    setSearchTerm,
    isLoading,
    isSubmitting,
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient
  };
}
