
export interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  client_name?: string;
  start_date?: string;
  end_date?: string;
  budget_hours?: number;
  budget_amount?: number;
  status: 'active' | 'completed' | 'onHold' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ProjectFormValues {
  name: string;
  description?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  budgetHours?: number;
  budgetAmount?: number;
  status: 'active' | 'completed' | 'onHold' | 'archived';
}
