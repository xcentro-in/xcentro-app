
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";
import { RewardPackage } from "../common/RewardTopUpStep";

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
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
  rewardPackage?: RewardPackage | null;
}

export interface BatchPaymentFormProps {
  onStepChange: (step: number) => void;
}
