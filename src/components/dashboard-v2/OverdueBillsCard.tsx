import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface OverdueBillsCardProps {
  overdueBills: {
    count: number;
    total: number;
  };
  delay?: number;
}

const OverdueBillsCard = ({ overdueBills, delay = 50 }: OverdueBillsCardProps) => {
  const navigate = useNavigate();
  const hasOverdue = overdueBills.count > 0;

  const handleClick = () => {
    if (hasOverdue) {
      // Navigate to bills page with overdue filter
      navigate('/bills?status=overdue');
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden animate-scale-in",
        hasOverdue && "border-red-500/20 bg-red-500/5 cursor-pointer hover:bg-red-500/10 transition-colors"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={hasOverdue ? handleClick : undefined}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Overdue Bills
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {hasOverdue ? (
          <>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div className="text-3xl font-bold text-red-600">
                {overdueBills.count}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {formatCurrency(overdueBills.total)} overdue
            </div>
            <div className="flex items-center gap-1 text-sm text-red-600 font-medium">
              <span>View overdue bills</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div className="text-xl font-semibold text-green-600">
                All dues clear
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              No overdue bills
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueBillsCard;
