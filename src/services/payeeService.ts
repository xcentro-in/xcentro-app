// API service for payee-related operations

export interface PayeeRelation {
  relation_id: string;
  business_id: string;
  payee_id: string;
  payee_type: "employee" | "vendor" | "biller";
  account_id: string;
  display_name: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
  is_favorite: boolean;
  tags: string[];
  added_at: string;
  added_by: string;
  updated_at: string;
}

export interface PayeeResponse {
  data: PayeeRelation[];
  message: string;
  page: number;
  page_size: number;
  status: string;
  total_count: number;
}

export interface PayeeFilters {
  page?: number;
  page_size?: number;
  search?: string;
  payee_type?: string;
  is_favorite?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const fetchPayees = async (filters: PayeeFilters = {}): Promise<PayeeResponse> => {
  const {
    page = 1,
    page_size = 10,
    search,
    payee_type,
    is_favorite
  } = filters;

  // Build query params
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('page_size', String(page_size));

  if (search) {
    params.append('search', search);
  }

  if (payee_type && payee_type !== 'all') {
    params.append('payee_type', payee_type);
  }

  if (is_favorite !== undefined) {
    params.append('is_favorite', String(is_favorite));
  }

  try {
    const response = await fetch(`${API_BASE_URL}/payees?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers if needed
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payees: ${response.statusText}`);
    }

    const data: PayeeResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching payees:', error);
    throw error;
  }
};
