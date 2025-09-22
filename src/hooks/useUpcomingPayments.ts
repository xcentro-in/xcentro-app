import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transaction';

export interface UpcomingPaymentsParams {
  // Pagination (table view only)
  page?: number;          // If omitted → return all (for calendar)
  limit?: number;         // If omitted → return all (for calendar)

  // Filtering
  month?: string;         // '2024-01' (calendar view only)
  search?: string;        // vendor + description (table view only)

  // Sorting
  sortBy?: 'date' | 'amount' | 'vendor';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UpcomingPaymentsResponse {
  payments: Transaction[];
  pagination?: PaginationInfo; // Only present when page/limit used
  filters: {
    month?: string;
    search?: string;
    appliedFilters: number;
  };
}

export const useUpcomingPayments = (params: UpcomingPaymentsParams = {}) => {
  const [data, setData] = useState<UpcomingPaymentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Default parameters
  const {
    page = 1,
    limit = 20,
    month,
    search = '',
    sortBy = 'date',
    sortOrder = 'asc'
  } = params;

  useEffect(() => {
    const fetchUpcomingPayments = async () => {
      if (!user?.businessId) return;

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const queryParams = new URLSearchParams();
        // if (page && limit) {
        //   queryParams.append('page', page.toString());
        //   queryParams.append('limit', limit.toString());
        // }
        // if (month) queryParams.append('month', month);
        // if (search) queryParams.append('search', search);
        // queryParams.append('sortBy', sortBy);
        // queryParams.append('sortOrder', sortOrder);
        // queryParams.append('businessId', user.businessId);

        // const response = await fetch(`/api/payments/upcoming?${queryParams}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        //   },
        // });

        // Mock API simulation
        await new Promise(resolve => setTimeout(resolve, 600));

        // Import mock data
        const { mockCalendarTransactions } = await import('@/data/mockCalendarEvents');

        // Simulate server-side filtering and pagination
        let filteredPayments = [...mockCalendarTransactions];

        // Filter by future dates (server-side logic)
        const today = new Date();
        filteredPayments = filteredPayments.filter(payment => {
          const paymentDate = new Date(payment.date);
          return paymentDate >= today || payment.status === 'upcoming';
        });

        // Apply month filter (calendar view)
        if (month) {
          filteredPayments = filteredPayments.filter(payment =>
            payment.date.startsWith(month)
          );
        }

        // Apply search filter (table view)
        if (search) {
          const searchLower = search.toLowerCase();
          filteredPayments = filteredPayments.filter(payment =>
            payment.vendor.toLowerCase().includes(searchLower) ||
            (payment.description?.toLowerCase() || '').includes(searchLower)
          );
        }

        // Apply sorting
        filteredPayments.sort((a, b) => {
          let aValue: any, bValue: any;

          switch (sortBy) {
            case 'date':
              aValue = new Date(a.date);
              bValue = new Date(b.date);
              break;
            case 'amount':
              aValue = a.amount;
              bValue = b.amount;
              break;
            case 'vendor':
              aValue = a.vendor.toLowerCase();
              bValue = b.vendor.toLowerCase();
              break;
            default:
              aValue = new Date(a.date);
              bValue = new Date(b.date);
          }

          if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        });

        // Apply pagination (only for table view)
        let paginatedPayments = filteredPayments;
        let paginationInfo: PaginationInfo | undefined;

        if (page && limit && !month) { // Table view (has pagination, no month filter)
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          paginatedPayments = filteredPayments.slice(startIndex, endIndex);

          paginationInfo = {
            page,
            limit,
            total: filteredPayments.length,
            totalPages: Math.ceil(filteredPayments.length / limit),
            hasNext: endIndex < filteredPayments.length,
            hasPrev: page > 1
          };
        }

        const response: UpcomingPaymentsResponse = {
          payments: paginatedPayments,
          pagination: paginationInfo,
          filters: {
            month,
            search: search || undefined,
            appliedFilters: (month ? 1 : 0) + (search ? 1 : 0)
          }
        };

        setData(response);
      } catch (err) {
        setError('Failed to fetch upcoming payments');
        console.error('Upcoming payments error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingPayments();
  }, [user?.businessId, page, limit, month, search, sortBy, sortOrder]);

  const refetch = () => {
    setData(null);
    setIsLoading(true);
    // The useEffect will trigger automatically
  };

  return {
    payments: data?.payments || [],
    pagination: data?.pagination,
    filters: data?.filters,
    isLoading,
    error,
    refetch
  };
};

// TODO: Backend API endpoint structure
/*
GET /api/payments/upcoming?businessId={businessId}&page=1&limit=20&search=vendor&sortBy=date&sortOrder=asc

Backend Implementation:
1. Query upcoming payments for business
2. Apply server-side filtering:
   - Future dates only (payment_date >= NOW())
   - Month filter if provided
   - Search on vendor_name and description
3. Apply sorting
4. Apply pagination if page/limit provided
5. Return results with pagination metadata

Example API Response:
{
  "success": true,
  "data": {
    "payments": Transaction[],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "search": "acme",
      "appliedFilters": 1
    }
  }
}
*/