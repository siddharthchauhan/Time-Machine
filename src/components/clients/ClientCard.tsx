
import { User, Mail, Phone, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "./ClientModel";

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export function ClientCard({ client, onEdit, onDelete }: ClientCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{client.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(client)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(client.id)}
              className="h-8 w-8 text-destructive"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          {client.billing_rate
            ? `Default rate: $${client.billing_rate.toFixed(2)}/hr`
            : "No default billing rate"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {client.contact_name && (
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>{client.contact_name}</span>
            </div>
          )}
          {client.contact_email && (
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>{client.contact_email}</span>
            </div>
          )}
          {client.contact_phone && (
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>{client.contact_phone}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
