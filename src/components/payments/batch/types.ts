
import { PaymentScheduleType } from "../common/PaymentScheduleSelector";

export interface PaymentRow {
  id: string;
  payee: string;
  amount: number;
  description: string;
  bankAccount: string;
  ifsc: string;
}

export interface BatchPaymentFormProps {
  onStepChange: (step: number) => void;
}

export interface BatchPaymentState {
  selectedRows: string[];
  selectedPaymentMethod?: string;
  paymentType: PaymentScheduleType;
  scheduledDate?: Date;
  frequency: string;
}
