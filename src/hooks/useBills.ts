import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Invoice } from '@/data/mockInvoices';
import { DateRange } from 'react-day-picker';
import { voucherAPI } from '@/services/api';
import { VoucherListResponseAPI, VoucherListItemAPI } from '@/types/vouchers-list-api';
import { VoucherDetailResponseAPI } from '@/types/voucher-detail-api';
import { format } from 'date-fns';

// Helper function to map API voucher to Invoice (for list view)
const mapVoucherToInvoice = (voucher: VoucherListItemAPI): Invoice => {
  return {
    id: voucher.voucherId,
    invoiceNumber: voucher.invoiceNumber,
    vendorName: voucher.payeeName,
    vendorAddress: '', // Not provided by API
    amount: voucher.totalAmount / 100, // Convert paise to rupees
    dueDate: voucher.invoiceDueDate || '', // Use empty string if null
    billDate: voucher.paymentDate || voucher.invoiceDueDate || '', // Use payment date or due date
    status: voucher.status,
    overdueDays: voucher.status === 'overdue' ? undefined : undefined, // Calculate if needed
    gstin: '', // Not provided by API
    items: [], // Not provided by list API
    cgst: 0, // Not provided by list API
    sgst: 0, // Not provided by list API
    igst: 0, // Not provided by list API
    terms: '', // Not provided by list API
    approvalStatus: voucher.approvalStatus, // Approval status from API
  };
};

// Helper function to map API voucher detail to Invoice (for detail view)
const mapVoucherDetailToInvoice = (voucherDetail: VoucherDetailResponseAPI): Invoice => {
  // Format dates to DD/MM/YYYY format (matching Invoice type expectations)
  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return '';
    try {
      return format(new Date(isoDate), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  };

  // Calculate overdue days if status is overdue
  const calculateOverdueDays = (dueDate: string | null, status: string): number | undefined => {
    if (status !== 'overdue' || !dueDate) return undefined;
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : undefined;
    } catch {
      return undefined;
    }
  };

  // Map approval status
  const mapApprovalStatus = (approvals: any[]): 'approved' | 'pending' | 'rejected' | null => {
    if (!approvals || approvals.length === 0) return null;

    // Check if any approval is rejected
    if (approvals.some(a => a.approval_status === 'rejected')) return 'rejected';

    // Check if all approvals are approved
    if (approvals.every(a => a.approval_status === 'approved')) return 'approved';

    // Otherwise, it's pending
    return 'pending';
  };

  return {
    id: voucherDetail.voucher_id,
    invoiceNumber: voucherDetail.invoice_number,
    vendorName: voucherDetail.payee.payee_name,
    vendorAddress: voucherDetail.payee.address || '',
    amount: voucherDetail.total_amount / 100, // Convert paise to rupees
    dueDate: formatDate(voucherDetail.invoice_due_date),
    billDate: formatDate(voucherDetail.bill_date),
    status: voucherDetail.payment_status,
    overdueDays: calculateOverdueDays(voucherDetail.invoice_due_date, voucherDetail.payment_status),
    gstin: voucherDetail.payee.gstin || '',
    items: voucherDetail.line_items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate / 100, // Convert paise to rupees
      amount: item.amount / 100, // Convert paise to rupees
    })),
    cgst: voucherDetail.cgst_amount / 100, // Convert paise to rupees
    sgst: voucherDetail.sgst_amount / 100, // Convert paise to rupees
    igst: voucherDetail.igst_amount / 100, // Convert paise to rupees
    terms: voucherDetail.payment_terms || '',
    approvalStatus: mapApprovalStatus(voucherDetail.approvals),
  };
};

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

// Simplified - no longer need to track counts
export interface BillsAppliedFilters {
  status: 'all' | 'paid' | 'open' | 'overdue';
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
    status: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Server-side parameters that trigger API calls
  const {
    status = 'all',
    page = 1,
    limit = 20,
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

      // Calculate offset for API call
      const offset = (page - 1) * limit;

      // Call real API
      const response = await voucherAPI.list(user.businessId, {
        status: status !== 'all' ? status : undefined,
        limit,
        offset,
      });

      // Validate response structure
      if (
        response &&
        typeof response === 'object' &&
        'vouchers' in response &&
        Array.isArray(response.vouchers)
      ) {
        const data = response as VoucherListResponseAPI;

        // Map API vouchers to Invoice type
        const mappedBills = data.vouchers.map(mapVoucherToInvoice);

        const total = data.total_count;
        const totalPages = Math.ceil(total / limit);

        // Update state
        setBills(mappedBills);
        setPagination({
          page,
          limit,
          total,
          totalPages
        });
        setAppliedFilters({
          status
        });
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid vouchers list response structure');
      }

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
    if (!user?.businessId) {
      throw new Error('Missing business ID');
    }

    try {
      // Call actual API to get voucher details
      const response = await voucherAPI.getDetails(user.businessId, billId);

      // Type the response
      const voucherDetail = response as VoucherDetailResponseAPI;

      // Map to Invoice type
      const bill = mapVoucherDetailToInvoice(voucherDetail);

      return bill;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bill details';
      throw new Error(errorMessage);
    }
  };

  // Request approval for a bill
  const requestApproval = async (billId: string, approverUserId: string) => {
    if (!user?.businessId) {
      throw new Error('Missing business ID');
    }

    try {
      const response = await voucherAPI.requestApproval(
        user.businessId,
        billId,
        approverUserId,
        '' // Empty remarks for now
      );

      // Type the response
      const data = response as {
        success: boolean;
        message: string;
        approval_id: string;
        voucher_id: string;
        action: string;
        action_taken_at: string | null;
      };

      // Note: We don't refresh bills here - let the component handle optimistic update
      // await fetchBills();

      return {
        success: data.success,
        message: data.message,
        approvalId: data.approval_id,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request approval';
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
    page,
    limit,
  ]);

  return {
    bills,
    pagination,
    appliedFilters,
    isLoading,
    error,
    refetch: fetchBills,
    payBill,
    getBillDetails,
    requestApproval
  };
};