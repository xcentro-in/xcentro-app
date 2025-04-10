
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const TaxCompositionChart: React.FC = () => {
  const data = [
    { name: 'IGST', value: 70, color: '#6366f1' }, // Indigo
    { name: 'CGST', value: 15, color: '#8b5cf6' }, // Purple
    { name: 'SGST', value: 13, color: '#ec4899' }, // Pink
    { name: 'Cess', value: 2, color: '#f97316' },  // Orange
  ];
  
  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      let insight = '';
      if (data.name === 'IGST' && data.value > 50) {
        insight = 'IGST surged 30% – Check if it aligns with your inter-state invoices';
      }

      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm font-medium" style={{ color: data.color }}>
            {data.value}%
          </p>
          {insight && (
            <p className="text-xs mt-1 text-amber-600 dark:text-amber-400 max-w-[200px]">
              {insight}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Tax Type Composition</CardTitle>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs">{entry.name}: {entry.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
