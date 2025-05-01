
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client, ClientFormValues } from "./ClientModel";
import ClientForm from "./ClientForm";

interface ClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentClient: Client | null;
  isSubmitting: boolean;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ClientDialog({
  isOpen,
  onOpenChange,
  currentClient,
  isSubmitting,
  onSubmit,
  onCancel
}: ClientDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  contactName: currentClient.contact_name,
                  contactEmail: currentClient.contact_email,
                  contactPhone: currentClient.contact_phone,
                  address: currentClient.address,
                  billingRate: currentClient.billing_rate,
                }
              : undefined
          }
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
