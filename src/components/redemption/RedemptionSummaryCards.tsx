
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Award, 
  TrendingDown, 
  TrendingUp, 
  Wallet, 
  Building 
} from "lucide-react";

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
      <Card className="border-blue-100 bg-blue-50/30">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-sm font-normal text-blue-700">Total Redeemed Points</CardTitle>
          <Wallet className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-blue-800">{totalRedeemedPoints.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card className="border-green-100 bg-green-50/30">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-sm font-normal text-green-700">Points This Month</CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-green-800">{thisMonthPoints.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card className="border-purple-100 bg-purple-50/30">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-sm font-normal text-purple-700">Most Redeemed</CardTitle>
          <Award className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-purple-800">
            {mostRedeemedCategory[0]} ({mostRedeemedPercentage}%)
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-amber-100 bg-amber-50/30">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-sm font-normal text-amber-700">Avg Points/Redemption</CardTitle>
          <TrendingDown className="h-5 w-5 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium text-amber-800">{avgPointsPerRedemption.toLocaleString()}</div>
        </CardContent>
      </Card>
      
      <Card className="border-teal-100 bg-teal-50/30">
        <CardHeader className="pb-2 flex flex-row items-start justify-between">
          <CardTitle className="text-sm font-normal text-teal-700">Max Transfers</CardTitle>
          <Building className="h-5 w-5 text-teal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium text-teal-800 truncate">{maxTransferSubsidiary[0]}</div>
          <div className="text-sm text-teal-600">{maxTransferSubsidiary[1].toLocaleString()} pts</div>
        </CardContent>
      </Card>
    </div>
  );
};
