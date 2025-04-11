export interface PayrollData {
  totalSalary: number;
  daysUntilPayday: number;
  incomingPayments: number;
  shortfall: number;
  cardPaymentSuggestion: number;
  bankPaymentSuggestion: number;
  lastMonthDelay: number;
  paymentMethodData: Array<{
    name: string;
    value: number;
  }>;
  complianceData: Array<{
    name: string;
    deducted: number;
    deposited: number;
    due: string;
    status: string;
  }>;
  salaryTrendData: Array<{
    month: string;
    amount: number;
  }>;
  paymentTimelinessData: Array<{
    month: string;
    paymentDate?: number;
    amount?: number;
    onTime?: number;
    delayed?: number;
    predicted?: number;
  }>;
  employeeData: Array<{
    id: number;
    name: string;
    gross: number;
    deductions: number;
    net: number;
  }>;
}
