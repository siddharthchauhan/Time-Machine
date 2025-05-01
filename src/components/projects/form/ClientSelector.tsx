
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "@/components/clients/ClientModel";

interface ClientSelectorProps {
  clientId: string | undefined;
  clients: Client[];
  onClientChange: (value: string) => void;
}

const ClientSelector = ({ clientId, clients, onClientChange }: ClientSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="clientId">Client</Label>
      <Select
        value={clientId || "none"}
        onValueChange={onClientChange}
      >
        <SelectTrigger id="clientId">
          <SelectValue placeholder="Select a client" />
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
