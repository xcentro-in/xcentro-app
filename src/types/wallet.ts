export interface StoredCard {
  card_id: string;
  last_four_digits: string;
  card_type: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'diners' | string;
  card_category: 'credit' | 'debit' | string;
  expiry_month: string;
  expiry_year: string;
  issuer_bank: string;
  card_status: 'active' | 'inactive' | 'failed' | 'pending';
  is_active: boolean;
  is_failed_tokenization: boolean;
  failure_reason?: string;
  nickname?: string;
}

export interface BankAccount {
  account_id: string;
  last_five_digits: string;
  bank_name: string;
  ifsc_code: string;
  account_type: 'savings' | 'current';
  is_active: boolean;
  is_verified: boolean;
}

export interface UpiDetails {
  // To be defined when UPI data is available
  upi_id?: string;
  is_active?: boolean;
}

export interface CreditLine {
  // To be defined when credit line data is available
  credit_line_id?: string;
  amount?: number;
}

export interface WalletData {
  business_id: string;
  stored_cards: StoredCard[];
  bank_accounts: BankAccount[];
  upi_details: UpiDetails | null;
  credit_lines: CreditLine | null;
  last_updated: string;
}

export interface GetWalletResponse {
  data: WalletData;
  endpoint: string;
  message: string;
  status: string;
}
