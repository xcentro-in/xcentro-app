import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { voucherAPI } from '@/services/api';
import { UnpaidVouchersResponse, UnpaidVoucherBill } from '@/types/unpaid-vouchers-api';
import { Invoice } from '@/data/mockInvoices';
import { format, differenceInDays, parseISO } from 'date-fns';

export const useUnpaidVouchers = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  const calculateOverdueDays = (dueDate: string | null): number | undefined => {
    if (!dueDate) return undefined;

    try {
      const due = parseISO(dueDate);
      if (isNaN(due.getTime())) return undefined; // Invalid date

      const today = new Date();
      const days = differenceInDays(today, due);
      return days > 0 ? days : undefined;
    } catch {
      return undefined;
    }
  };

  const formatDateSafely = (dateString: string | null): string => {
    if (!dateString) return 'N/A';

    try {
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'N/A'; // Invalid date
      return format(date, 'dd/MM/yyyy');
    } catch {
      return 'N/A';
    }
  };

  const mapVoucherToInvoice = (voucher: UnpaidVoucherBill): Invoice => {
    const overdueDays = voucher.status === 'overdue'
      ? calculateOverdueDays(voucher.due_date)
      : undefined;

    return {
      id: voucher.voucher_id,
      invoiceNumber: voucher.invoice_number || 'N/A',
      vendorName: voucher.vendor_name || 'Unknown Vendor',
      vendorAddress: '', // Not provided by API
      amount: (voucher.total_amount || 0) / 100, // Convert paise to rupees
      dueDate: formatDateSafely(voucher.due_date),
      billDate: formatDateSafely(voucher.due_date), // Using due date as fallback
      status: voucher.status || 'open',
      overdueDays: overdueDays,
      gstin: voucher.vendor_gstin || '',
      items: [], // Not provided by API
      cgst: 0, // Not provided by API
      sgst: 0, // Not provided by API
      igst: 0, // Not provided by API
      terms: '', // Not provided by API
      approvalStatus: 'approved', // Since these are unpaid approved vouchers
    };
  };

  const fetchUnpaidVouchers = useCallback(async () => {
    if (!user?.businessId) {
      setError('Missing business ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await voucherAPI.getUnpaidVouchers(user.businessId) as UnpaidVouchersResponse;

      const mappedInvoices = response.bills.map(mapVoucherToInvoice);
      setInvoices(mappedInvoices);
      setTotalCount(response.total_count);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch unpaid vouchers';
      setError(errorMessage);
      console.error('Error fetching unpaid vouchers:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.businessId]);

  useEffect(() => {
    if (user?.businessId) {
      fetchUnpaidVouchers();
    }
  }, [user?.businessId, fetchUnpaidVouchers]);

  return {
    invoices,
    isLoading,
    error,
    totalCount,
    refetch: fetchUnpaidVouchers,
  };
};
