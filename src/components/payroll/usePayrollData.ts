
import { useState } from "react";
import { PayrollData } from "./types";

export const usePayrollData = () => {
  // Mock data for charts and tables
  const [payrollData] = useState<PayrollData>({
    totalSalary: 380000,
    daysUntilPayday: 6,
    incomingPayments: 150000,
    shortfall: 230000,
    cardPaymentSuggestion: 150000,
    bankPaymentSuggestion: 230000,
    lastMonthDelay: 2,
    paymentMethodData: [
      { name: "Bank Transfer", value: 70 },
      { name: "Credit Card", value: 30 }
    ],
    complianceData: [
      { name: "TDS", deducted: 100000, deposited: 80000, due: "Apr 7", status: "Pending" },
      { name: "PF", deducted: 50000, deposited: 50000, due: "Apr 15", status: "Completed" },
      { name: "ESI", deducted: 25000, deposited: 25000, due: "Apr 21", status: "Completed" }
    ],
    salaryTrendData: [
      { month: "Jan", amount: 350000 },
      { month: "Feb", amount: 360000 },
      { month: "Mar", amount: 370000 },
      { month: "Apr", amount: 380000 },
    ],
    paymentTimelinessData: [
      { month: "Nov", paymentDate: 27, amount: 340000, onTime: 100 },
      { month: "Dec", paymentDate: 26, amount: 345000, onTime: 100 },
      { month: "Jan", paymentDate: 25, amount: 350000, onTime: 100 },
      { month: "Feb", paymentDate: 25, amount: 360000, onTime: 100 },
      { month: "Mar", paymentDate: 27, amount: 370000, delayed: 2 },
      { month: "Apr", paymentDate: 25, amount: 380000, predicted: 0 }
    ],
    employeeData: [
      { id: 1, name: "Amit Sharma", gross: 80000, deductions: 15000, net: 65000 },
      { id: 2, name: "Priya Singh", gross: 65000, deductions: 12000, net: 53000 },
      { id: 3, name: "Rahul Gupta", gross: 90000, deductions: 18000, net: 72000 },
      { id: 4, name: "Neha Patel", gross: 75000, deductions: 14000, net: 61000 },
      { id: 5, name: "Vijay Kumar", gross: 70000, deductions: 13000, net: 57000 }
    ]
  });

  const [payDate, setPayDate] = useState(25);

  return {
    payrollData,
    payDate,
    setPayDate
  };
};

export default usePayrollData;
