
import { RewardPackage } from "../shared/common/RewardTopUpStep";

export interface Employee {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  bankName: string;
  salaryAmount: number;
  contactNumber: string;
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
