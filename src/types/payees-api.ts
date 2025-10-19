export interface PayeeAPIResponse {
  relation_id: string;
  business_id: string;
  payee_id: string;
  account_id: string;
  display_name: string;
  contact_email: string;
  contact_phone: string;
  notes: string;
  is_active: boolean;
  is_favorite: boolean;
  tags: string[];
  added_at: string;
  added_by: string;
  updated_at: string;
}

export interface GetPayeesResponse {
  data: PayeeAPIResponse[] | null;
  message: string;
  page: number;
  page_size: number;
  status: string;
  total_count: number;
}
