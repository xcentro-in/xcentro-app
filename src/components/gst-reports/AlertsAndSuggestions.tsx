
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, TrendingDown, Calculator } from 'lucide-react';

export const AlertsAndSuggestions: React.FC = () => {
  const alerts = [
    {
      type: 'upcoming',
      icon: Bell,
      title: 'Due in 6 days',
      description: 'Your average delay is 2.3 days. Wanna break the streak?',
    },
    {
      type: 'warning',
      icon: TrendingDown,
      title: 'High IGST',
      description: "You're paying 70% in IGST. Are your vendors out of state?",
    },
    {
      type: 'info',
      icon: Calculator,
      title: 'Potential Refund',
      description: 'Overpaid ₹1,800 in Feb? Claim it back next month.',
    },
  ];

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'upcoming':
        return 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/30';
      case 'warning':
        return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/30';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/30';
      default:
        return '';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'upcoming':
        return 'text-amber-600 dark:text-amber-400';
      case 'warning':
        return 'text-red-600 dark:text-red-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Alerts & Smart Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 grid gap-4">
        {alerts.map((alert, index) => (
          <Alert key={index} className={`${getAlertStyles(alert.type)} border-l-4`}>
            <alert.icon className={`h-4 w-4 ${getIconStyles(alert.type)}`} />
            <AlertTitle className={`${getIconStyles(alert.type)}`}>{alert.title}</AlertTitle>
            <AlertDescription className="text-sm">
              {alert.description}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
