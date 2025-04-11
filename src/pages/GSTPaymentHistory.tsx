
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, AlertCircle, Filter } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatePickerWithRange } from '@/components/ui/date-range-picker';

const GSTPaymentHistory = () => {
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 6);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: sixMonthsAgo,
    to: today,
  });
  
  const paymentHistoryData = [
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
  
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;
  
  const getRowColorClass = (delay: number) => {
    if (delay === 0) return '';
    if (delay === 1) return 'bg-amber-50 dark:bg-amber-950/20';
    return 'bg-red-50 dark:bg-red-950/20';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/gst-reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">GST Payment History</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Payment History</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Filter Period:</span>
              <DatePickerWithRange
                date={dateRange}
                setDate={setDateRange}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Paid Amount</TableHead>
                  <TableHead>Paid On</TableHead>
                  <TableHead>Delay</TableHead>
                  <TableHead className="text-right">Credit Used</TableHead>
                  <TableHead className="text-right">Cash Paid</TableHead>
                  <TableHead className="text-right">Penalty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistoryData.map((payment, index) => (
                  <TableRow 
                    key={index}
                    className={getRowColorClass(payment.delay)}
                  >
                    <TableCell>{payment.month}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.paidOn}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.creditUsed)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(payment.cashPaid)}</TableCell>
                    <TableCell className="text-right">
                      {payment.penalty > 0 ? (
                        <span className="text-red-600">{formatCurrency(payment.penalty)}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTPaymentHistory;
