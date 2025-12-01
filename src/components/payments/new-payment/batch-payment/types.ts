
import { RewardPackage } from "../shared/common/RewardTopUpStep";

export interface PaymentRow {
  id: string;
  payee: string;
  amount: number;
  description: string;
  bankAccount: string;
  ifsc: string;
}

export interface BatchPaymentState {
  selectedRows: string[];
  selectedPaymentMethod?: string;
  rewardPackage?: RewardPackage | null;
}

export interface BatchPaymentFormProps {
  onStepChange: (step: number) => void;
}

// Batch Upload API Response Types
export interface MatchedPayment {
  row_number: number;
  csv_payee_name: string;
  csv_account_last_4: string;
  amount: number; // in paise
  payment_context: string;
  description: string;
  matched_relation_id: string;
  matched_payee_name: string;
  matched_account: string;
  matched_bank_name: string;
  match_confidence: number; // 0-1
  invoice_number: string | null;
}

export interface PossibleMatch {
  relation_id: string;
  payee_name: string;
  account_last_4: string;
  bank_name: string;
  match_confidence: number;
}

export interface AmbiguousPayment {
  row_number: number;
  csv_payee_name: string;
  csv_account_last_4: string;
  amount: number; // in paise
  payment_context: string;
  description: string;
  possible_matches: PossibleMatch[];
}

export interface NotFoundPayment {
  row_number: number;
  csv_payee_name: string;
  csv_account_last_4: string;
  amount: number; // in paise
  payment_context: string;
  description: string;
  reason: string;
}

export interface BatchUploadResponse {
  data: {
    batch_id: string;
    total_rows: number;
    matched_count: number;
    ambiguous_count: number;
    not_found_count: number;
    matched: MatchedPayment[];
    ambiguous: AmbiguousPayment[];
    not_found: NotFoundPayment[];
    total_amount: number; // in paise
    file_name: string;
    uploaded_at: string; // ISO 8601
  };
  message: string;
  status: string;
}

// Voucher Creation Response Types
export interface CreatedVoucher {
  voucher_id: string;
  invoice_number: string;
  status: string; // 'draft'
  message: string;
}

export interface VoucherCreationResponse {
  message: string;
  status: string; // 'success'
  data: {
    vouchers: CreatedVoucher[];
    message: string;
  };
}
