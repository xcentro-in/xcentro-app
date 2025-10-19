// API Response types for GET /v1/payees/details/:payee_id

// Common bank details structure used by vendor and employee
export interface BankDetailsAPI {
  account_number: string;
  ifsc_code: string;
  bank_name: string;
  branch_name: string;
  account_type: 'current' | 'savings';
  account_holder_name: string;
  is_verified: boolean;
  is_primary: boolean;
}

// Base payee details (common fields)
interface BasePayeeDetailsAPI {
  relation_id: string;
  payee_type: 'vendor' | 'biller' | 'employee';
  display_name: string;
  contact_email: string;
  contact_phone: string;
  tags: string[];
  is_favorite: boolean;
}

// Vendor payee details
export interface VendorPayeeDetailsAPI extends BasePayeeDetailsAPI {
  payee_type: 'vendor';
  gstin: string;
  legal_name: string;
  gst_status: string;
  city: string;
  state: string;
  bank_details: BankDetailsAPI;
}

// Biller payee details
export interface BillerPayeeDetailsAPI extends BasePayeeDetailsAPI {
  payee_type: 'biller';
  biller_name: string;
  biller_category: string;
  mobile_number: string;
  last_bill_amount: number; // Amount in paise
  last_bill_due_date: string; // ISO date string
}

// Employee payee details
export interface EmployeePayeeDetailsAPI extends BasePayeeDetailsAPI {
  payee_type: 'employee';
  pan: string;
  full_name: string;
  employee_code: string;
  designation: string;
  department: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  bank_details: BankDetailsAPI;
}

// Discriminated union for payee details
export type PayeeDetailsDataAPI = VendorPayeeDetailsAPI | BillerPayeeDetailsAPI | EmployeePayeeDetailsAPI;

// Complete API response
export interface GetPayeeDetailsResponse {
  data: PayeeDetailsDataAPI;
  status: 'success' | 'error';
  message?: string;
}
