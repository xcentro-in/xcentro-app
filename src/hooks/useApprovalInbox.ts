import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentBusiness } from './useCurrentBusiness';
import { voucherAPI } from '@/services/api';
import { ApprovalInboxResponse, ApprovalInboxVoucher, ApprovalAction } from '@/types/approval-inbox-api';
import { ApprovalTransaction } from '@/types/approval';

// Helper function to map API voucher to ApprovalTransaction
const mapVoucherToTransaction = (voucher: ApprovalInboxVoucher): ApprovalTransaction => {
  // Get the latest approval request (last item in chronological order)
  const latestApproval = voucher.approval_history[voucher.approval_history.length - 1];

  return {
    id: voucher.voucher_id,
    payee: voucher.payee_name,
    description: latestApproval?.remarks || '',
    amount: voucher.total_amount / 100, // Convert paise to rupees
    date: latestApproval?.created_at || new Date().toISOString(),
    status: voucher.current_approval_status,
    requestedBy: {
      name: latestApproval?.requester_name || '',
      role: '', // Not provided by API
    },
    invoiceNumber: voucher.invoice_number,
    dueDate: voucher.invoice_due_date || '',
    category: '', // Not provided by API
    notes: latestApproval?.remarks || '',
    paymentMethod: 'bank', // Default, not provided by API
    initiatedBy: latestApproval?.requester_name || '',
    initiatorRole: '', // Not provided by API
    requestedDate: latestApproval?.created_at || new Date().toISOString(),
    isRead: true, // All marked as read
    approvalHistory: voucher.approval_history.map(history => ({
      approvalId: history.approval_id,
      requesterUserId: history.requester_user_id,
      requesterName: history.requester_name,
      approverUserId: history.approver_user_id,
      approverName: history.approver_name,
      action: history.action,
      remarks: history.remarks,
      createdAt: history.created_at,
    })),
  };
};

export const useApprovalInbox = (status: ApprovalAction) => {
  const [transactions, setTransactions] = useState<ApprovalTransaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { businessId } = useCurrentBusiness();

  const fetchApprovalInbox = async () => {
    if (!businessId) {
      setError('Missing business ID');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await voucherAPI.getApprovalInbox(businessId, status);

      // Validate response structure
      if (
        response &&
        typeof response === 'object' &&
        'vouchers' in response &&
        Array.isArray(response.vouchers)
      ) {
        const data = response as ApprovalInboxResponse;

        // Map API vouchers to ApprovalTransaction type
        const mappedTransactions = data.vouchers.map(mapVoucherToTransaction);

        setTransactions(mappedTransactions);
        setTotalCount(data.total_count);
      } else {
        console.error('Unexpected response structure:', response);
        throw new Error('Invalid approval inbox response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch approval inbox';
      setError(errorMessage);
      console.error('Error fetching approval inbox:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchApprovalInbox();
    }
  }, [businessId, status]);

  return {
    transactions,
    totalCount,
    isLoading,
    error,
    refetch: fetchApprovalInbox,
  };
};
