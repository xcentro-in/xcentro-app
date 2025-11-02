
import { RewardPackage } from "../shared/common/RewardTopUpStep";

export interface Employee {
  relation_id: string; // API uses relation_id as unique identifier
  full_name: string;
  email: string;
  phone: string;
  account_number_last4: string;
  ifsc_code: string;
  salaryAmount?: number; // User-entered salary amount
}

export interface PayrollReviewStepProps {
  selectedEmployees: Employee[];
  selectedPaymentMethod?: string;
  paymentType: "now" | "later" | "recurring";
  scheduledDate?: Date;
  frequency: string;
  rewardPackage?: RewardPackage | null;
  onBack: () => void;
  onSubmit: () => void;
}
