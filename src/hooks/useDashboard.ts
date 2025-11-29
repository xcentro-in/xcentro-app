import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

// Helper to convert paise to rupees
const paiseToRupees = (paise: number): number => paise / 100;

export interface DashboardData {
  currentMonthSpend: number;
  lastMonthSpend: number;
  spendChange: number;
  overdueBills: {
    count: number;
    total: number;
  };
  recentActivity: Array<{
    id: string;
    amount: number;
    status: string;
    date: string;
  }>;
  upcomingLargePayments: Array<{
    id: string;
    vendor: string;
    amount: number;
    date: string;
  }>;
  monthlySpendData: Array<{
    month: string;
    spent: number;
  }>;
  creditCardExpenses: Array<{
    name: string;
    value: number;
  }>;
}

export const useDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.businessId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await apiService.dashboard.getData(user.businessId);

        // Transform API response to component-friendly format
        const transformed: DashboardData = {
          // Current month spend (convert paise to rupees)
          currentMonthSpend: paiseToRupees(response.total_spend_this_month),

          // Calculate last month spend from monthly_spends
          lastMonthSpend: response.monthly_spends.length >= 2
            ? paiseToRupees(response.monthly_spends[response.monthly_spends.length - 2].total_spend)
            : 0,

          // Calculate percentage change
          spendChange: 0, // Will be calculated in component

          // Overdue bills
          overdueBills: {
            count: response.overdue_bills.count,
            total: paiseToRupees(response.overdue_bills.total_amount),
          },

          // Recent activity (last 6 payments)
          recentActivity: response.recent_payments.slice(0, 6).map(payment => ({
            id: payment.payment_id,
            amount: paiseToRupees(payment.amount),
            status: payment.status,
            date: payment.created_at,
          })),

          // Upcoming large payments (top 3)
          upcomingLargePayments: response.upcoming_large_payments.slice(0, 3).map(payment => ({
            id: payment.voucher_id,
            vendor: payment.invoice_number, // Using invoice number as vendor for now
            amount: paiseToRupees(payment.net_amount),
            date: payment.invoice_due_date,
          })),

          // Monthly spend chart data (last 6 months)
          monthlySpendData: response.monthly_spends.slice(-6).map(month => ({
            month: format(new Date(month.month), 'MMM'),
            spent: paiseToRupees(month.total_spend),
          })),

          // Credit card expenses (use source_label)
          creditCardExpenses: response.payment_source_breakdown
            .filter(source => source.total_amount > 0)
            .map(source => ({
              name: source.source_label,
              value: paiseToRupees(source.total_amount),
            })),
        };

        // Calculate spend change percentage
        if (transformed.lastMonthSpend > 0) {
          transformed.spendChange =
            ((transformed.currentMonthSpend - transformed.lastMonthSpend) / transformed.lastMonthSpend) * 100;
        }

        setData(transformed);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.businessId]);

  return { data, isLoading, error };
};
