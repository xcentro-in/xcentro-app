
import React, { useState } from "react";
import usePayrollData from "@/components/payroll/usePayrollData";
import SalaryCommitmentCard from "@/components/payroll/SalaryCommitmentCard";
import CashFlowProjectionCard from "@/components/payroll/CashFlowProjectionCard";
import SmartPaymentSuggestionCard from "@/components/payroll/SmartPaymentSuggestionCard";
import PaymentTimelinessCard from "@/components/payroll/PaymentTimelinessCard";
import PaymentMethodAnalysisCard from "@/components/payroll/PaymentMethodAnalysisCard";
import ComplianceTrackerCard from "@/components/payroll/ComplianceTrackerCard";
import PaydaySimulationCard from "@/components/payroll/PaydaySimulationCard";
import EmployeeSalaryBreakdownCard from "@/components/payroll/EmployeeSalaryBreakdownCard";
import PayrollVarianceReportCard from "@/components/payroll/PayrollVarianceReportCard";

const PayrollReport = () => {
  const { payrollData, payDate, setPayDate } = usePayrollData();
  
  const simulatePaydayChange = (newDate: number) => {
    setPayDate(newDate);
    // In a real app, this would recalculate cash flow projections
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Payroll Report</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Optimize your salary payments and track compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Salary Commitment */}
        <SalaryCommitmentCard 
          totalSalary={payrollData.totalSalary} 
          daysUntilPayday={payrollData.daysUntilPayday} 
        />

        {/* Projected Cash Flow vs Salary Obligation */}
        <CashFlowProjectionCard 
          incomingPayments={payrollData.incomingPayments} 
          totalSalary={payrollData.totalSalary} 
          shortfall={payrollData.shortfall} 
        />

        {/* Smart Payment Suggestion */}
        <SmartPaymentSuggestionCard 
          cardPaymentSuggestion={payrollData.cardPaymentSuggestion} 
          bankPaymentSuggestion={payrollData.bankPaymentSuggestion} 
        />

        {/* Payment Timeliness */}
        <PaymentTimelinessCard 
          paymentTimelinessData={payrollData.paymentTimelinessData} 
          lastMonthDelay={payrollData.lastMonthDelay} 
        />

        {/* Payment Method Analysis */}
        <PaymentMethodAnalysisCard 
          paymentMethodData={payrollData.paymentMethodData} 
        />

        {/* Compliance Tracker */}
        <ComplianceTrackerCard 
          complianceData={payrollData.complianceData} 
        />

        {/* Payday Simulation Tool */}
        <PaydaySimulationCard 
          payDate={payDate} 
          onPayDateChange={simulatePaydayChange} 
        />

        {/* Employee-Level Insights */}
        <EmployeeSalaryBreakdownCard 
          employeeData={payrollData.employeeData} 
        />

        {/* Payroll Variance Report */}
        <PayrollVarianceReportCard 
          salaryTrendData={payrollData.salaryTrendData} 
        />
      </div>
    </div>
  );
};

export default PayrollReport;
