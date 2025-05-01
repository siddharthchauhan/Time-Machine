
export interface Client {
  id: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  billingRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormValues {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  billingRate?: number;
}
