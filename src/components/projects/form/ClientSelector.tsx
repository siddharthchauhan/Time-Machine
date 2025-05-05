import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "@/components/clients/ClientModel";
import { useAuth } from "@/hooks/use-auth";

interface ClientSelectorProps {
  clientId: string | undefined;
  clients?: Client[];
  onClientChange: (value: string) => void;
}

const ClientSelector = ({ clientId, clients: providedClients, onClientChange }: ClientSelectorProps) => {
  const [clients, setClients] = useState<Client[]>(providedClients || []);
  const [isLoading, setIsLoading] = useState(!providedClients);
  const { supabase, profile } = useAuth();
  
  useEffect(() => {
    // If clients are provided via props, use those
    if (providedClients && providedClients.length > 0) {
      setClients(providedClients);
      setIsLoading(false);
      return;
    }
    
    // Otherwise fetch clients
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // For guest user, use localStorage
        if (profile?.id === 'guest') {
          const storedClients = localStorage.getItem('guestClients');
          if (storedClients) {
            const parsedClients = JSON.parse(storedClients);
            setClients(parsedClients);
          }
          setIsLoading(false);
          return;
        }
        
        // For real users, fetch from database
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("name");

        if (error) {
          console.error("Error fetching clients:", error);
          return;
        }

        if (data) {
          setClients(data);
        }
      } catch (error) {
        console.error("Error in fetchClients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [supabase, profile, providedClients]);

  return (
    <div className="space-y-1">
      <Label htmlFor="clientId">Client</Label>
      <Select
        value={clientId || "none"}
        onValueChange={onClientChange}
        disabled={isLoading}
      >
        <SelectTrigger id="clientId">
          <SelectValue placeholder={isLoading ? "Loading clients..." : "Select a client"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
