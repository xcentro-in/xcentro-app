
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PaymentDetailsTable: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'6' | '12'>('6');
  
  const paymentData = [
    { month: 'Mar', amount: 18200, paidOn: 'Mar 20', delay: 0, creditUsed: 2100, cashPaid: 16100, penalty: 0 },
    { month: 'Feb', amount: 15800, paidOn: 'Feb 22', delay: 2, creditUsed: 1800, cashPaid: 14000, penalty: 100 },
    { month: 'Jan', amount: 16400, paidOn: 'Jan 21', delay: 1, creditUsed: 2000, cashPaid: 14400, penalty: 50 },
    { month: 'Dec', amount: 17100, paidOn: 'Dec 20', delay: 0, creditUsed: 2200, cashPaid: 14900, penalty: 0 },
    { month: 'Nov', amount: 19500, paidOn: 'Nov 23', delay: 3, creditUsed: 2500, cashPaid: 17000, penalty: 150 },
    { month: 'Oct', amount: 22800, paidOn: 'Oct 20', delay: 0, creditUsed: 3000, cashPaid: 19800, penalty: 0 },
    { month: 'Sep', amount: 16200, paidOn: 'Sep 21', delay: 1, creditUsed: 2100, cashPaid: 14100, penalty: 50 },
    { month: 'Aug', amount: 13900, paidOn: 'Aug 20', delay: 0, creditUsed: 1800, cashPaid: 12100, penalty: 0 },
    { month: 'Jul', amount: 15100, paidOn: 'Jul 19', delay: 0, creditUsed: 1900, cashPaid: 13200, penalty: 0 },
    { month: 'Jun', amount: 13800, paidOn: 'Jun 22', delay: 2, creditUsed: 1700, cashPaid: 12100, penalty: 100 },
    { month: 'May', amount: 14200, paidOn: 'May 20', delay: 0, creditUsed: 1800, cashPaid: 12400, penalty: 0 },
    { month: 'Apr', amount: 12500, paidOn: 'Apr 21', delay: 1, creditUsed: 1600, cashPaid: 10900, penalty: 50 },
  ];
  
  const displayData = timeframe === '6' ? paymentData.slice(0, 6) : paymentData;
  
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;
  
  const getRowColorClass = (delay: number) => {
    if (delay === 0) return '';
    if (delay === 1) return 'bg-amber-50 dark:bg-amber-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Payment Details</CardTitle>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/gst-payment-history" className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors">
                    <span className="mr-1">View Full History</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View complete GST payment history</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex gap-2">
              <Button 
                variant={timeframe === '6' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('6')}
                className="h-8"
              >
                Last 6 months
              </Button>
              <Button 
                variant={timeframe === '12' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeframe('12')}
                className="h-8"
              >
                Last 12 months
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Month</th>
                <th className="text-right py-3 px-4 font-medium">Paid Amount</th>
                <th className="text-left py-3 px-4 font-medium">Paid On</th>
                <th className="text-left py-3 px-4 font-medium">Delay</th>
                <th className="text-right py-3 px-4 font-medium">Credit Used</th>
                <th className="text-right py-3 px-4 font-medium">Cash Paid</th>
                <th className="text-right py-3 px-4 font-medium">Penalty</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((payment, index) => (
                <tr 
                  key={index} 
                  className={`border-b hover:bg-muted/50 ${getRowColorClass(payment.delay)}`}
                >
                  <td className="py-3 px-4">{payment.month}</td>
                  <td className="py-3 px-4 text-right font-medium">{formatCurrency(payment.amount)}</td>
                  <td className="py-3 px-4">{payment.paidOn}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {payment.delay === 0 ? (
                        <span className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1" /> On time
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <AlertCircle className="h-4 w-4 mr-1" /> {payment.delay} days
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">{formatCurrency(payment.creditUsed)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(payment.cashPaid)}</td>
                  <td className="py-3 px-4 text-right">
                    {payment.penalty > 0 ? (
                      <span className="text-red-600">{formatCurrency(payment.penalty)}</span>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
