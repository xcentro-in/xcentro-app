
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
