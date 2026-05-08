export interface Vendor {
  relation_id: string;
  payee_id?: string;
  display_name: string;
  contact_email: string;
  contact_phone: string;
  gstin?: string;
}

export interface GetVendorsResponse {
  data: {
    vendors: Vendor[];
    count: number;
  } | null;
  status: string;
}
