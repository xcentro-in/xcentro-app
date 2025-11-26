export interface Vendor {
  relation_id: string;
  display_name: string;
  contact_email: string;
  contact_phone: string;
}

export interface GetVendorsResponse {
  data: {
    vendors: Vendor[];
    count: number;
  } | null;
  status: string;
}
