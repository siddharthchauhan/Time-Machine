
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "./ClientModel";
import { ClientCard } from "./ClientCard";

interface ClientListProps {
  clients: Client[];
  isLoading: boolean;
  searchTerm: string;
  onClearSearch: () => void;
  onAddClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
}

export function ClientList({
  clients,
  isLoading,
  searchTerm,
  onClearSearch,
  onAddClient,
  onEditClient,
  onDeleteClient
}: ClientListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6 space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-muted-foreground mb-2 text-center">
            {searchTerm
              ? "No clients found matching your search."
              : "No clients found. Create your first client to get started!"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={onClearSearch}>
              Clear search
            </Button>
          ) : (
            <Button onClick={onAddClient}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client} 
          onEdit={onEditClient}
          onDelete={onDeleteClient}
        />
      ))}
    </div>
  );
}
