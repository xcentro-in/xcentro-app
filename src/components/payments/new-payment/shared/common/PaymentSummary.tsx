
import { TransactionSummary } from "./TransactionSummary";
import { PaymentType } from "@/types/payments";
import { Payee } from "@/types/payee";
import { PaymentMethod } from "@/types/payment-method";
import { Employee } from "../../payroll/types";

interface PaymentSummaryProps {
  paymentType: PaymentType;
  scheduledDate?: Date;
  amount: number;
  description: string;
  invoiceReference: string;
  frequency?: string;
  payee?: Payee;
  paymentMethod?: PaymentMethod;
  platformFee: number;
  gatewayFee: number;
  totalAmount: number;
  rewardPoints: number;
  employees?: Employee[];
  onBack: () => void;
}

// This component exists for backward compatibility
// It's recommended to directly use TransactionSummary for new code
export const PaymentSummary = (props: PaymentSummaryProps) => {
  return <TransactionSummary {...props} />;
};
