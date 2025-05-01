
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientFormValues } from "./ClientModel";
import { useToast } from "@/hooks/use-toast";

interface ClientFormProps {
  initialValues?: ClientFormValues;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ClientForm = ({
  initialValues = {
    name: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    billingRate: undefined,
  },
  onSubmit,
  isSubmitting,
  onCancel,
}: ClientFormProps) => {
  const [values, setValues] = useState<ClientFormValues>(initialValues);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === "billingRate" ? parseFloat(value) || undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!values.name.trim()) {
      toast({
        title: "Client name required",
        description: "Please enter a client name",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(values);
    } catch (error: any) {
      console.error("Error submitting client:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialValues.name ? "Edit Client" : "Create New Client"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Client Name*</Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="contactName">Contact Person</Label>
            <Input
              id="contactName"
              name="contactName"
              value={values.contactName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={values.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={values.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={values.address}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="billingRate">Default Hourly Rate</Label>
            <Input
              id="billingRate"
              name="billingRate"
              type="number"
              min="0"
              step="0.01"
              value={values.billingRate || ""}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialValues.name
              ? "Update Client"
              : "Create Client"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ClientForm;
