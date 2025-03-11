
import { Clock, ArrowRight, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  { title: "Schedule Payment", icon: Clock, description: "Set up future payments" },
  { title: "Bulk Transfers", icon: ArrowRight, description: "Pay multiple vendors" },
  { title: "View Analytics", icon: BarChart2, description: "Track your spending" },
];

const QuickActions = () => {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        <CardDescription>Frequently used operations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <div 
            key={action.title} 
            className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
          >
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <action.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-medium">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
