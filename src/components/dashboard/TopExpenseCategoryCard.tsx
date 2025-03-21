
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TopExpenseCategoryCard = () => {
  // This would typically be data fetched from an API
  const topCategory = {
    name: "Payroll",
    percentage: 38,
    amount: "$28,687"
  };

  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: "50ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Top Expense Category</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{topCategory.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {topCategory.percentage}% of monthly spend
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="mt-2 text-sm font-medium">
          {topCategory.amount} this month
        </div>
      </CardContent>
    </Card>
  );
};

export default TopExpenseCategoryCard;
