
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
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PayrollReport = () => {
  const navigate = useNavigate();
  const { payrollData, payDate, setPayDate } = usePayrollData();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("Payroll Report");
  }, [setTitle]);

  const simulatePaydayChange = (newDate: number) => {
    setPayDate(newDate);
    // In a real app, this would recalculate cash flow projections
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Optimize your salary payments and track compliance
          </p>
        </div>
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
        
        {/* Payroll Variance Report - Moved here right after Payment Timeliness */}
        <PayrollVarianceReportCard 
          salaryTrendData={payrollData.salaryTrendData} 
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
      </div>
    </div>
  );
};

export default PayrollReport;
