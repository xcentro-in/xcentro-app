
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RedemptionSummaryProps {
  totalRedeemedPoints: number;
  thisMonthPoints: number;
  mostRedeemedCategory: [string, number];
  mostRedeemedPercentage: number;
  avgPointsPerRedemption: number;
  maxTransferSubsidiary: [string, number];
}

export const RedemptionSummaryCards = ({
  totalRedeemedPoints,
  thisMonthPoints,
  mostRedeemedCategory,
  mostRedeemedPercentage,
  avgPointsPerRedemption,
  maxTransferSubsidiary
}: RedemptionSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Redeemed Points</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRedeemedPoints.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Points This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{thisMonthPoints.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Most Redeemed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mostRedeemedCategory[0]} ({mostRedeemedPercentage}%)
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Avg Points/Redemption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgPointsPerRedemption.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Max Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold truncate">{maxTransferSubsidiary[0]}</div>
          <div className="text-sm text-muted-foreground">{maxTransferSubsidiary[1].toLocaleString()} pts</div>
        </CardContent>
      </Card>
    </div>
  );
};
