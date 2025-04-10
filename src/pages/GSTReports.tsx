
import React from 'react';
import { PageHeader } from '@/components/gst-reports/PageHeader';
import { GSTHealthMetrics } from '@/components/gst-reports/GSTHealthMetrics';
import { MonthlyTrendsChart } from '@/components/gst-reports/MonthlyTrendsChart';
import { TaxCompositionChart } from '@/components/gst-reports/TaxCompositionChart';
import { PaymentDetailsTable } from '@/components/gst-reports/PaymentDetailsTable';
import { AlertsAndSuggestions } from '@/components/gst-reports/AlertsAndSuggestions';
import { ForecastSection } from '@/components/gst-reports/ForecastSection';
import { IndustryComparison } from '@/components/gst-reports/IndustryComparison';

const GSTReports = () => {
  return (
    <div className="space-y-6">
      <PageHeader />
      
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
