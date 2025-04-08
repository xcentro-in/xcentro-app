
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RedemptionSummaryCards } from "@/components/redemption/RedemptionSummaryCards";
import { RedemptionFilters } from "@/components/redemption/RedemptionFilters";
import { RedemptionTable } from "@/components/redemption/RedemptionTable";
import { RedemptionPieChart, RedemptionLineChart } from "@/components/redemption/RedemptionCharts";
import { redemptionHistoryData, pieChartData, COLORS, lineChartData } from "@/data/redemptionHistoryData";

interface RedemptionHistoryProps {
  embeddedView?: boolean;
}

const RedemptionHistory = ({ embeddedView = false }: RedemptionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeTab, setActiveTab] = useState("table");

  // Filter redemption history data
  const filteredData = redemptionHistoryData.filter(item => {
    const matchesSearch = 
      item.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    
    // Date filtering logic would go here if we had actual Date objects
    
    return matchesSearch && matchesType;
  });
  
  // Calculate summary metrics
  const totalRedeemedPoints = redemptionHistoryData.reduce((sum, item) => sum + item.points, 0);
  
  // Calculate points redeemed this month (assuming March 2025)
  const thisMonthPoints = redemptionHistoryData
    .filter(item => item.date.includes("Mar"))
    .reduce((sum, item) => sum + item.points, 0);
  
  // Find most redeemed category
  const categoryPoints: Record<string, number> = {};
  redemptionHistoryData.forEach(item => {
    categoryPoints[item.type] = (categoryPoints[item.type] || 0) + item.points;
  });
  
  const mostRedeemedCategory = Object.entries(categoryPoints)
    .sort((a, b) => b[1] - a[1])[0];
  
  const mostRedeemedPercentage = Math.round((mostRedeemedCategory[1] / totalRedeemedPoints) * 100);
  
  // Average points per redemption
  const avgPointsPerRedemption = Math.round(totalRedeemedPoints / redemptionHistoryData.length);
  
  // Find subsidiary with max transfers
  const subsidiaryTransfers: Record<string, number> = {};
  redemptionHistoryData
    .filter(item => item.type === "Transfer")
    .forEach(item => {
      subsidiaryTransfers[item.partner] = (subsidiaryTransfers[item.partner] || 0) + item.points;
    });
  
  const maxTransferSubsidiary = Object.entries(subsidiaryTransfers)
    .sort((a, b) => b[1] - a[1])[0] || ["None", 0];

  return (
    <div className="space-y-6">
      {!embeddedView && (
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Redemption History</h1>
          <p className="text-muted-foreground">
            Track all your reward point redemptions across categories and subsidiaries
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <RedemptionSummaryCards 
        totalRedeemedPoints={totalRedeemedPoints}
        thisMonthPoints={thisMonthPoints}
        mostRedeemedCategory={mostRedeemedCategory}
        mostRedeemedPercentage={mostRedeemedPercentage}
        avgPointsPerRedemption={avgPointsPerRedemption}
        maxTransferSubsidiary={maxTransferSubsidiary}
      />

      {/* Tabs for switching between table and charts view */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="pie">Category Distribution</TabsTrigger>
          <TabsTrigger value="line">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-4">
          {/* Filters */}
          <RedemptionFilters 
            searchTerm={searchTerm}
            filterType={filterType}
            dateRange={dateRange}
            onSearchTermChange={setSearchTerm}
            onFilterTypeChange={setFilterType}
            onDateRangeChange={setDateRange}
          />
          
          {/* Table */}
          <RedemptionTable data={filteredData} />
        </TabsContent>
        
        <TabsContent value="pie">
          <RedemptionPieChart pieData={pieChartData} colors={COLORS} />
        </TabsContent>
        
        <TabsContent value="line">
          <RedemptionLineChart lineData={lineChartData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RedemptionHistory;
