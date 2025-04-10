
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Calendar } from 'lucide-react';

export const PageHeader: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">GST Reports</h1>
      </div>
      
      <Card className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-800/50 rounded-full p-2">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-900 dark:text-indigo-200">
                Last GST payment: ₹18,200 on Mar 20 | Next due in 6 days. Feeling organized?
              </h3>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                Your filing history shows you're usually just in time. Set up an automatic reminder?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
