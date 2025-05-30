
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Clock, Calendar, Lightbulb } from "lucide-react";

interface ActivityData {
  date: Date;
  intensity: number;
  payments: number;
  amount?: number;
}

interface TooltipData {
  date: Date;
  payments: number;
  amount?: number;
}

const PaymentActivityMap = () => {
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [tooltip, setTooltip] = useState<{ show: boolean; data?: TooltipData; x: number; y: number }>({
    show: false,
    x: 0,
    y: 0
  });

  useEffect(() => {
    setActivityData(generateActivityData());
  }, []);

  const generateActivityData = (): ActivityData[] => {
    const data: ActivityData[] = [];
    const today = new Date();
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const day = d.getDate();
      let intensity = 0;
      
      // Salary day pattern
      if (day === 1) intensity = 4;
      // Mid-month payments
      else if (day === 15) intensity = 3;
      // GST/Tax days
      else if (day === 20) intensity = 4;
      // Utility payment days
      else if (day >= 5 && day <= 10) intensity = Math.random() > 0.6 ? 2 : 1;
      // Random other payments
      else if (Math.random() > 0.8) intensity = Math.floor(Math.random() * 3) + 1;
      
      data.push({
        date: new Date(d),
        intensity: intensity,
        payments: intensity * 2 + Math.floor(Math.random() * 3),
        amount: intensity > 0 ? (intensity * 15000 + Math.random() * 10000) : 0
      });
    }
    
    return data;
  };

  const getIntensityClass = (intensity: number): string => {
    const classes = [
      'bg-gray-100',
      'bg-green-200',
      'bg-green-400',
      'bg-green-600',
      'bg-green-800'
    ];
    return classes[intensity] || classes[0];
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCellHover = (event: React.MouseEvent, dayData: ActivityData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      data: {
        date: dayData.date,
        payments: dayData.payments,
        amount: dayData.amount
      },
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 60
    });
  };

  const handleCellLeave = () => {
    setTooltip({ show: false, x: 0, y: 0 });
  };

  // Group data by weeks
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];
  
  activityData.forEach(dayData => {
    const dayOfWeek = dayData.date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    
    currentWeek.push(dayData);
  });
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  // Calculate month positions for proper alignment
  const getMonthPositions = () => {
    const positions: { month: string; position: number }[] = [];
    let weekIndex = 0;
    
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const month = monthLabels[monthIndex];
      positions.push({ month, position: weekIndex * 4.5 }); // Approximate position
      
      // Add weeks for this month (roughly 4.3 weeks per month)
      weekIndex += 4.3;
    }
    
    return positions;
  };

  const monthPositions = getMonthPositions();

  return (
    <Card className="col-span-full animate-fade-in" style={{ animationDelay: "100ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Payment Activity</CardTitle>
        <CardDescription>
          Last 12 months - Each square represents payment activity on that day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Container for responsive scrolling */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Month labels */}
            <div className="relative mb-2 h-4">
              {monthPositions.map((monthPos, index) => (
                <span 
                  key={index} 
                  className="absolute text-xs text-muted-foreground"
                  style={{ left: `${20 + monthPos.position}px` }}
                >
                  {monthPos.month}
                </span>
              ))}
            </div>

            {/* Activity grid */}
            <div className="space-y-1">
              {dayLabels.map((dayLabel, dayOfWeek) => (
                <div key={dayOfWeek} className="flex items-center gap-1">
                  <div className="w-6 text-xs text-muted-foreground text-right">
                    {dayLabel}
                  </div>
                  <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => {
                      const dayData = week.find(d => d.date.getDay() === dayOfWeek);
                      return (
                        <div
                          key={weekIndex}
                          className={`w-3 h-3 cursor-pointer transition-all hover:scale-110 border border-gray-200 ${
                            dayData ? getIntensityClass(dayData.intensity) : 'bg-gray-100'
                          }`}
                          onMouseEnter={dayData ? (e) => handleCellHover(e, dayData) : undefined}
                          onMouseLeave={handleCellLeave}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(level => (
              <div
                key={level}
                className={`w-3 h-3 border border-gray-200 ${getIntensityClass(level)}`}
              />
            ))}
          </div>
          <span>More</span>
          <span className="ml-4 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" />
            Darker = More payments that day
          </span>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Flame className="h-4 w-4 text-red-500" />
              Most Active Days
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>1st:</strong> Salary payments</div>
              <div><strong>15th:</strong> Vendor payments</div>
              <div><strong>20th:</strong> GST obligations</div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Consistency
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                95% Regular
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Very consistent payment patterns with predictable cycles.
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Quiet Periods
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Mid-month:</strong> Lowest activity</div>
              <div><strong>Month-end:</strong> Planning period</div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-2 font-medium text-sm mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Seasonal Patterns
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Mar & Dec:</strong> Bonus months</div>
              <div><strong>Summer:</strong> Higher utilities</div>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip.show && tooltip.data && (
          <div
            className="fixed bg-gray-800 text-white text-xs p-2 rounded shadow-lg pointer-events-none z-50"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <div className="font-medium">{tooltip.data.date.toLocaleDateString()}</div>
            <div>{tooltip.data.payments} payments made</div>
            {tooltip.data.amount && tooltip.data.amount > 0 && (
              <div>{formatCurrency(tooltip.data.amount)}</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentActivityMap;
