
export interface Client {
  id: string;
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  billing_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface ClientFormValues {
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  billingRate?: number;
}
