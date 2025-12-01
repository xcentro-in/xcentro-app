
import { ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TopCategory {
  name: string;
  percentage: number;
  amount: number;
}

interface TopExpenseCategoryCardProps {
  topCategory?: TopCategory | null;
}

const TopExpenseCategoryCard = ({ topCategory = null }: TopExpenseCategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden animate-scale-in" style={{ animationDelay: "50ms" }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">Top Expense Category</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {!topCategory ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="rounded-full bg-muted/50 p-2 mb-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">No expense data available</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Make payments to track expenses
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2 h-auto p-0 text-xs"
              onClick={() => navigate('/new-payment')}
            >
              Make a Payment
            </Button>
          </div>
        ) : (
          <>
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
              {formatCurrency(topCategory.amount)} this month
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TopExpenseCategoryCard;
