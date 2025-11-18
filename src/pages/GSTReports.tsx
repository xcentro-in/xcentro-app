
import React from 'react';
import { PageHeader } from '@/components/gst-reports/PageHeader';
import { GSTHealthMetrics } from '@/components/gst-reports/GSTHealthMetrics';
import { MonthlyTrendsChart } from '@/components/gst-reports/MonthlyTrendsChart';
import { TaxCompositionChart } from '@/components/gst-reports/TaxCompositionChart';
import { PaymentDetailsTable } from '@/components/gst-reports/PaymentDetailsTable';
import { AlertsAndSuggestions } from '@/components/gst-reports/AlertsAndSuggestions';
import { ForecastSection } from '@/components/gst-reports/ForecastSection';
import { IndustryComparison } from '@/components/gst-reports/IndustryComparison';
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GSTReports = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle("GST Reports");
  }, [setTitle]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <PageHeader />
      </div>
      
      <div className="grid gap-6">
        <GSTHealthMetrics />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonthlyTrendsChart />
          <TaxCompositionChart />
        </div>
        
        <PaymentDetailsTable />
        <AlertsAndSuggestions />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ForecastSection />
          <IndustryComparison />
        </div>
      </div>
    </div>
  );
};

export default GSTReports;
