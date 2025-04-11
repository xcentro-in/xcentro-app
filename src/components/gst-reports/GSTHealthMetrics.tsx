
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, Clock, CreditCard } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const GSTHealthMetrics: React.FC = () => {
  const metrics = [
    {
      title: "Total Paid",
      value: "₹18,200",
      icon: CreditCard,
      color: "bg-indigo-500",
      trend: {
        value: "",
        direction: "neutral"
      },
      tooltip: "Total GST paid in the current quarter"
    },
    {
      title: "MoM Change",
      value: "15%",
      icon: ArrowUpIcon,
      color: "bg-green-500",
      trend: {
        value: "↑",
        direction: "up"
      },
      tooltip: "Increase in GST payment compared to previous month"
    },
    {
      title: "Payment Timeliness",
      value: "0 Days Late",
      icon: Clock,
      color: "bg-blue-500",
      trend: {
        value: "",
        direction: "neutral"
      },
      tooltip: "You've been paying on time - keep it up!"
    },
    {
      title: "Input Tax Credit Used",
      value: "₹2,100",
      icon: CreditCard,
      color: "bg-purple-500",
      trend: {
        value: "",
        direction: "neutral"
      },
      tooltip: "Input Tax Credit utilized in the current filing"
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">GST Health Snapshot</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="overflow-hidden transition-all hover:shadow-md animate-fade-in" style={{
                  animationDelay: `${index * 100}ms`
                }}>
                  <div className={`h-1 ${metric.color}`}></div>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{metric.title}</p>
                        <div className="flex items-center gap-1">
                          <p className="text-2xl font-bold">{metric.value}</p>
                          {metric.trend.direction === "up" && (
                            <ArrowUpIcon className="h-4 w-4 text-green-500" />
                          )}
                          {metric.trend.direction === "down" && (
                            <ArrowDownIcon className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className={`${metric.color} bg-opacity-10 rounded-full p-2 h-fit`}>
                        <metric.icon className={`h-4 w-4 ${metric.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{metric.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};
