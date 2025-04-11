
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export const IndustryComparison: React.FC = () => {
  const comparisonData = [
    {
      title: "GST as % of Revenue",
      yourValue: 3.1,
      industryAvg: 2.4,
      icon: Building,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      progressColor: "bg-indigo-600 dark:bg-indigo-400",
      description: "You paid 3.1% of revenue. Average: 2.4%",
      isBetter: false
    },
    {
      title: "Filing Timeliness",
      yourValue: 1.2,
      industryAvg: 3.2,
      icon: Clock,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      progressColor: "bg-green-600 dark:bg-green-400",
      description: "You're 2 days earlier than average filers. Smug yet?",
      isBetter: true
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Industry Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Compared to similar businesses (Retail, Maharashtra)
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-6">
        {comparisonData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full ${item.bgColor}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
              <span className="font-medium text-sm">{item.title}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span>You</span>
                  <span>Industry Avg</span>
                </div>
                <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`absolute h-full ${item.progressColor} rounded-full`}
                    style={{ 
                      width: `${(item.yourValue / Math.max(item.yourValue, item.industryAvg)) * 100}%` 
                    }}
                  ></div>
                  <div 
                    className="absolute h-full w-px bg-gray-400 dark:bg-gray-500"
                    style={{ 
                      left: `${(item.industryAvg / Math.max(item.yourValue, item.industryAvg)) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>{item.yourValue}%</span>
                  <span>{item.industryAvg}%</span>
                </div>
              </div>
              
              <div>
                <div className={`rounded-full p-1 ${item.isBetter ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                  <TrendingUp className={`h-3 w-3 ${item.isBetter ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`} />
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
