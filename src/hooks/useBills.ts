import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Invoice } from '@/data/mockInvoices';
import { DateRange } from 'react-day-picker';

// Server-side filter parameters for bills
export interface BillsFilters {
  // Column header filters (trigger API calls)
  status?: 'all' | 'paid' | 'open' | 'overdue';
  dateRange?: DateRange;
  dueDateRange?: DateRange;
  vendor?: string[];
  amountMin?: number;
  amountMax?: number;
  dueWithin?: number; // bills due within X days

  // Pagination (triggers API calls)
  page?: number;
  limit?: number;

  // Sorting (triggers API calls)
  sortBy?: 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface BillsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BillsAppliedFilters {
  status: 'all' | 'paid' | 'open' | 'overdue';
  dateRange?: DateRange;
  dueDateRange?: DateRange;
  vendor: string[];
  totalResults: number;
  overdueCount: number;
  openCount: number;
  paidCount: number;
}

export interface BillsResponse {
  bills: Invoice[];
  pagination: BillsPagination;
  appliedFilters: BillsAppliedFilters;
  success: boolean;
  message?: string;
}

// Hook for fetching bills with server-side filtering and pagination
export const useBills = (filters: BillsFilters = {}) => {
  const [bills, setBills] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<BillsPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [appliedFilters, setAppliedFilters] = useState<BillsAppliedFilters>({
    status: 'all',
    dateRange: undefined,
    dueDateRange: undefined,
    vendor: [],
    totalResults: 0,
    overdueCount: 0,
    openCount: 0,
    paidCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Server-side parameters that trigger API calls
  const {
    status = 'all',
    dateRange,
    dueDateRange,
    vendor = [],
    amountMin,
    amountMax,
    dueWithin,
    page = 1,
    limit = 20,
    sortBy = 'dueDate',
    sortOrder = 'asc'
  } = filters;

  const fetchBills = async () => {
    if (!user?.businessId) {
      setError('Missing business ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call
      /*
      const response = await api.bills.getAll(user.businessId, {
        status: status !== 'all' ? status : undefined,
        billDateFrom: dateRange?.from?.toISOString(),
        billDateTo: dateRange?.to?.toISOString(),
        dueDateFrom: dueDateRange?.from?.toISOString(),
        dueDateTo: dueDateRange?.to?.toISOString(),
        vendors: vendor.length > 0 ? vendor : undefined,
        amountMin,
        amountMax,
        dueWithin,
        page,
        limit,
        sortBy,
        sortOrder
      });
      */

      // Mock API simulation
      console.log('TODO: Fetching bills with filters:', {
        status,
        dateRange,
        dueDateRange,
        vendor,
        amountMin,
        amountMax,
        dueWithin,
        page,
        limit,
        sortBy,
        sortOrder
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Import and filter mock data
      const { mockInvoices } = await import('@/data/mockInvoices');
      let filteredBills = [...mockInvoices];

      // Apply server-side filters

      // Status filter
      if (status !== 'all') {
        filteredBills = filteredBills.filter(bill => bill.status === status);
      }

      // Vendor filter
      if (vendor.length > 0) {
        filteredBills = filteredBills.filter(bill =>
          vendor.some(v => bill.vendorName.toLowerCase().includes(v.toLowerCase()))
        );
      }

      // Bill date range filter
      if (dateRange?.from || dateRange?.to) {
        filteredBills = filteredBills.filter(bill => {
          const billDate = new Date(bill.billDate);
          const from = dateRange.from;
          const to = dateRange.to;

          if (from && to) {
            return billDate >= from && billDate <= to;
          } else if (from) {
            return billDate >= from;
          } else if (to) {
            return billDate <= to;
          }
          return true;
        });
      }

      // Due date range filter
      if (dueDateRange?.from || dueDateRange?.to) {
        filteredBills = filteredBills.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          const from = dueDateRange.from;
          const to = dueDateRange.to;

          if (from && to) {
            return dueDate >= from && dueDate <= to;
          } else if (from) {
            return dueDate >= from;
          } else if (to) {
            return dueDate <= to;
          }
          return true;
        });
      }

      // Amount range filter
      if (amountMin !== undefined) {
        filteredBills = filteredBills.filter(bill => bill.amount >= amountMin);
      }
      if (amountMax !== undefined) {
        filteredBills = filteredBills.filter(bill => bill.amount <= amountMax);
      }

      // Due within X days filter
      if (dueWithin !== undefined) {
        const today = new Date();
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + dueWithin);

        filteredBills = filteredBills.filter(bill => {
          const dueDate = new Date(bill.dueDate);
          return dueDate >= today && dueDate <= targetDate;
        });
      }

      // Calculate filter counts
      const allBills = mockInvoices;
      const overdueCount = allBills.filter(bill => bill.status === 'overdue').length;
      const openCount = allBills.filter(bill => bill.status === 'open').length;
      const paidCount = allBills.filter(bill => bill.status === 'paid').length;

      // Sorting
      filteredBills.sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case 'dueDate':
            aValue = new Date(a.dueDate);
            bValue = new Date(b.dueDate);
            break;
          case 'billDate':
            aValue = new Date(a.billDate);
            bValue = new Date(b.billDate);
            break;
          case 'amount':
            aValue = a.amount;
            bValue = b.amount;
            break;
          case 'vendor':
            aValue = a.vendorName;
            bValue = b.vendorName;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            aValue = new Date(a.dueDate);
            bValue = new Date(b.dueDate);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Pagination
      const total = filteredBills.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const paginatedBills = filteredBills.slice(startIndex, startIndex + limit);

      // Update state
      setBills(paginatedBills);
      setPagination({
        page,
        limit,
        total,
        totalPages
      });
      setAppliedFilters({
        status,
        dateRange,
        dueDateRange,
        vendor,
        totalResults: total,
        overdueCount,
        openCount,
        paidCount
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bills';
      setError(errorMessage);
      console.error('Error fetching bills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pay bill function
  const payBill = async (billId: string, paymentData?: any) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.bills.pay(user.businessId, billId, paymentData);

      console.log('TODO: Pay bill via API:', { billId, paymentData });

      // Simulate payment success
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh bills data after payment
      await fetchBills();

      return { success: true, message: 'Bill paid successfully' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pay bill';
      throw new Error(errorMessage);
    }
  };

  // Get bill details (for detailed view)
  const getBillDetails = async (billId: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.bills.getDetails(user.businessId, billId);

      console.log('TODO: Get bill details via API:', { billId });

      // Return mock data for now
      const { mockInvoices } = await import('@/data/mockInvoices');
      const bill = mockInvoices.find(b => b.id === billId);

      if (!bill) {
        throw new Error('Bill not found');
      }

      return bill;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bill details';
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (user?.businessId) {
      fetchBills();
    }
  }, [
    user?.businessId,
    status,
    dateRange?.from,
    dateRange?.to,
    dueDateRange?.from,
    dueDateRange?.to,
    vendor?.join(','),
    amountMin,
    amountMax,
    dueWithin,
    page,
    limit,
    sortBy,
    sortOrder
  ]);

  return {
    bills,
    pagination,
    appliedFilters,
    isLoading,
    error,
    refetch: fetchBills,
    payBill,
    getBillDetails
  };
};