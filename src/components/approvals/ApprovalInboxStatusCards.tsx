
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle, Flag, CheckCircle2 } from "lucide-react";

interface ApprovalInboxStatusCardsProps {
  pendingCount: number;
  urgentCount: number;
  flaggedCount: number;
  completedCount: number;
}

const ApprovalInboxStatusCards = ({
  pendingCount,
  urgentCount,
  flaggedCount,
  completedCount
}: ApprovalInboxStatusCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card className="bg-muted/50 animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "50ms" }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Urgent</p>
            <p className="text-2xl font-bold">{urgentCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "100ms" }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Flagged</p>
            <p className="text-2xl font-bold">{flaggedCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Flag className="h-5 w-5 text-amber-500" />
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-muted/50 animate-fade-in" style={{ animationDelay: "150ms" }}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ApprovalInboxStatusCards;
