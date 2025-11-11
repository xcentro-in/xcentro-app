import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/formatters";
import { formatPaymentDate } from "@/utils/dateFormatting";
import { canViewFeature } from "@/lib/featureFlags";
import { formatDistanceToNow, format } from "date-fns";
import { voucherAPI } from "@/services/api";
import { toast } from "sonner";
import { EXPENSE_CATEGORIES } from "@/constants/expenseCategories";
import { PAYMENT_TERMS } from "@/constants/paymentTerms";
import { GST_RATES, GST_TYPES, GSTType } from "@/constants/gstRates";
import {
  VoucherDetailsResponseAPI,
  VoucherActivityResponseAPI,
  VoucherPaymentResponseAPI,
  VoucherAccountingResponseAPI,
  VoucherAttachmentsResponseAPI
} from "@/types/voucher-summary-api";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Eye,
  FileText,
  Clock,
  CreditCard,
  Activity,
  Paperclip,
  BarChart3,
  Download,
  X,
  FilePlus,
  User,
  Trash2,
  MoreVertical,
  Edit,
  Plus
} from "lucide-react";

// Simplified bill summary type (from API)
interface BillSummary {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorAddress: string;
  vendorGstin: string;
  amount: number; // in rupees (converted from paise)
  dueDate: string;
  billDate: string;
  status: 'paid' | 'open' | 'overdue'; // @deprecated
  voucherStatus: 'draft' | 'finalized' | 'posted' | 'synced';
  paymentStatus: 'pending' | 'success' | 'failed' | 'cancelled' | null;
  approvalStatus: 'approved' | 'pending' | 'rejected' | 'request_changes' | '' | null;
  overdueDays?: number;
  terms: string;
  // Payee details
  payeeType: string; // 'vendor', 'biller', 'employee', 'salary'
  payeeBankAccountMasked?: string;
  payeeIfscCode?: string;
  payeeBankName?: string;
  payeeAccountType?: string;
  // Additional fields for employee type
  description?: string;
  expenseCategory?: string;
  tdsAmount?: number;
  // Details tab data (included in summary)
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
}

// Line item interface for edit mode
interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gst_rate: number;
  gst_amount: number;
}

// Edit form data interface
interface EditFormData {
  invoiceNumber: string;
  billDate: string;
  dueDate: string;
  vendorReferenceNumber: string;
  expenseCategory: string;
  description: string;
  paymentTerms: string;
  items: LineItem[];
  gstType: GSTType;
  discountType: 'amount' | 'percentage';
  discountValue: number;
  discountAmount: number;
  roundOff: boolean;
  roundOffAmount: number;
  subtotal: number;
  totalGst: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grossAmount: number;
  netAmount: number;
}

// Helper function to get event display properties based on action
const getEventDisplay = (action: string) => {
  switch (action) {
    case 'created':
      return { icon: FilePlus, color: 'text-blue-600', label: 'Voucher Created' };
    case 'updated':
      return { icon: FileText, color: 'text-gray-600', label: 'Voucher Updated' };
    case 'approved':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Approved' };
    case 'rejected':
      return { icon: X, color: 'text-red-600', label: 'Rejected' };
    case 'request_changes':
      return { icon: AlertCircle, color: 'text-blue-600', label: 'Requested Changes' };
    case 'pending':
      return { icon: Clock, color: 'text-yellow-600', label: 'Pending Approval' };
    case 'paid':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Payment Completed' };
    case 'status_changed':
      return { icon: AlertCircle, color: 'text-gray-600', label: 'Status Changed' };
    case 'submitted':
      return { icon: FileText, color: 'text-blue-600', label: 'Submitted for Approval' };
    case 'finalized':
      return { icon: CheckCircle, color: 'text-green-600', label: 'Finalized' };
    default:
      return { icon: Clock, color: 'text-gray-600', label: action.charAt(0).toUpperCase() + action.slice(1) };
  }
};

// Helper function to generate description from activity
const getActivityDescription = (activity: any): string => {
  // If remarks exist, use them
  if (activity.remarks && activity.remarks.trim()) {
    return activity.remarks;
  }

  // Otherwise generate description from activity_type and action
  const activityTypeMap: { [key: string]: string } = {
    'voucher_created': 'created the voucher',
    'voucher_updated': 'updated the voucher',
    'voucher_submitted': 'submitted the voucher for approval',
    'voucher_approved': 'approved the voucher',
    'voucher_rejected': 'rejected the voucher',
    'voucher_finalized': 'finalized the voucher',
    'status_changed': 'changed the status',
    'payment_initiated': 'initiated payment',
    'payment_completed': 'completed payment',
  };

  return activityTypeMap[activity.activity_type] || activity.activity_type.replace(/_/g, ' ');
};

// Helper function to map API response to BillSummary
const mapVoucherToBill = (response: VoucherDetailsResponseAPI): BillSummary => {
  const formatDate = (isoDate: string | null): string => {
    if (!isoDate) return '';
    try {
      return format(new Date(isoDate), 'dd/MM/yyyy');
    } catch {
      return '';
    }
  };

  const voucher = response.data;

  // Calculate payment status (paid/open/overdue) - deprecated
  const calculatePaymentStatus = (): 'paid' | 'open' | 'overdue' => {
    // Check payment_status field for actual status
    if (voucher.payment_status === 'success') return 'paid';

    // Check if overdue
    if (voucher.invoice_due_date) {
      const dueDate = new Date(voucher.invoice_due_date);
      const today = new Date();
      if (today > dueDate) return 'overdue';
    }

    return 'open';
  };

  // Calculate overdue days
  const calculateOverdueDays = (): number | undefined => {
    if (!voucher.invoice_due_date) return undefined;
    const dueDate = new Date(voucher.invoice_due_date);
    const today = new Date();
    if (today <= dueDate) return undefined;

    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : undefined;
  };

  // Check if financial_details exists and has line_items
  const hasFinancialDetails = voucher.financial_details &&
                               voucher.financial_details.line_items &&
                               Array.isArray(voucher.financial_details.line_items);

  // Calculate subtotal (sum of line items before GST)
  const subtotal = hasFinancialDetails
    ? voucher.financial_details.line_items.reduce((sum, item) => sum + item.amount, 0)
    : 0;

  // Calculate IGST (if gst_type is not cgst_sgst)
  const igstAmount = hasFinancialDetails && voucher.financial_details.gst_type === 'cgst_sgst'
    ? 0
    : voucher.gst_amount;

  return {
    id: voucher.voucher_id,
    invoiceNumber: voucher.invoice_number,
    vendorName: voucher.payee.name,
    vendorAddress: '', // Not provided in response
    vendorGstin: voucher.payee.gstin || '',
    amount: voucher.gross_amount / 100, // Convert paise to rupees
    dueDate: formatDate(voucher.invoice_due_date),
    billDate: formatDate(voucher.invoice_date),
    status: calculatePaymentStatus(), // @deprecated
    voucherStatus: voucher.voucher_status, // Direct from API: 'draft', 'finalized', 'posted', 'synced'
    paymentStatus: voucher.payment_status, // Direct from API
    approvalStatus: voucher.approval_status || '', // Direct from API
    overdueDays: calculateOverdueDays(),
    terms: '', // Not provided in response
    // Payee details
    payeeType: voucher.payee.type,
    payeeBankAccountMasked: voucher.payee.bank_account_masked,
    payeeIfscCode: voucher.payee.ifsc_code,
    payeeBankName: voucher.payee.bank_name,
    payeeAccountType: voucher.payee.account_type,
    // Additional fields for employee type
    description: voucher.description,
    expenseCategory: voucher.expense_category,
    tdsAmount: voucher.tds_amount / 100,
    items: hasFinancialDetails
      ? voucher.financial_details.line_items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate / 100,
          amount: item.amount / 100,
        }))
      : [],
    subtotal: subtotal / 100,
    cgst: voucher.cgst_amount / 100,
    sgst: voucher.sgst_amount / 100,
    igst: igstAmount / 100,
  };
};

const BillDetailPage = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setTitle } = usePageTitle();

  // Main bill data (loaded on page load)
  const [bill, setBill] = useState<BillSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment status from main voucher response (determines Pay button and Payment tab visibility)
  const [voucherPaymentStatus, setVoucherPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'cancelled' | null>(null);

  // Voucher status from main response (determines Delete button visibility) - UNUSED, using bill.voucherStatus instead
  const [voucherStatus, setVoucherStatus] = useState<'draft' | 'finalized' | 'posted' | 'synced'>('draft');

  // Attachments from main voucher response
  const [attachments, setAttachments] = useState<any[]>([]);

  // Tab-specific data (lazy-loaded)
  const [activityData, setActivityData] = useState<VoucherActivityResponseAPI | null>(null);
  const [paymentData, setPaymentData] = useState<VoucherPaymentResponseAPI | null>(null);
  const [accountingData, setAccountingData] = useState<VoucherAccountingResponseAPI | null>(null);

  // Loading states for each tab
  const [loadingTabs, setLoadingTabs] = useState({
    activity: false,
    payment: false,
    accounting: false,
  });

  // Track which tabs have been loaded (for caching)
  const [loadedTabs, setLoadedTabs] = useState({
    activity: false,
    payment: false,
    accounting: false,
  });

  // Delete confirmation modal state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [originalEditData, setOriginalEditData] = useState<EditFormData | null>(null); // Store original for change detection
  const [isSaving, setIsSaving] = useState(false);

  // Approval state
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);

  useEffect(() => {
    setTitle(isEditMode ? "Edit Bill" : "Bill Details");
  }, [setTitle, isEditMode]);

  // Initialize edit form data when entering edit mode
  useEffect(() => {
    if (isEditMode && bill) {
      const initialData: EditFormData = {
        invoiceNumber: bill.invoiceNumber,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        vendorReferenceNumber: '',
        expenseCategory: bill.expenseCategory || '',
        description: bill.description || '',
        paymentTerms: bill.terms || 'net_30',
        items: bill.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          gst_rate: 18, // Default, will need to calculate from item data
          gst_amount: 0
        })),
        gstType: bill.igst > 0 ? GST_TYPES.IGST : GST_TYPES.CGST_SGST,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        roundOff: false,
        roundOffAmount: 0,
        subtotal: bill.subtotal,
        totalGst: bill.cgst + bill.sgst + bill.igst,
        cgstAmount: bill.cgst,
        sgstAmount: bill.sgst,
        igstAmount: bill.igst,
        grossAmount: bill.amount,
        netAmount: bill.amount,
      };

      setEditFormData(initialData);
      // Store original data for change detection
      setOriginalEditData(JSON.parse(JSON.stringify(initialData))); // Deep clone
    }
  }, [isEditMode, bill]);

  // Fetch voucher details on page load (includes header + details tab)
  useEffect(() => {
    const fetchVoucherDetails = async () => {
      if (!billId || !user?.businessId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Fetch voucher details (includes header + details tab)
        const response = await voucherAPI.getDetails(user.businessId, billId);
        const voucherResponse = response as VoucherDetailsResponseAPI;

        // Map to BillSummary
        const mappedBill = mapVoucherToBill(voucherResponse);
        setBill(mappedBill);

        // Extract payment status from response
        setVoucherPaymentStatus(voucherResponse.data.payment_status);

        // Extract voucher status from response
        setVoucherStatus(voucherResponse.data.voucher_status);

        // Extract attachments from response (if available)
        if (voucherResponse.data.attachments && Array.isArray(voucherResponse.data.attachments)) {
          setAttachments(voucherResponse.data.attachments);
        } else {
          setAttachments([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bill details';
        setError(errorMessage);
        console.error('Error fetching voucher details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoucherDetails();
  }, [billId, user?.businessId]);

  // Lazy-load activity tab
  const loadActivityTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.activity) return;

    try {
      setLoadingTabs(prev => ({ ...prev, activity: true }));
      const response = await voucherAPI.getActivity(user.businessId, billId);
      setActivityData(response as VoucherActivityResponseAPI);
      setLoadedTabs(prev => ({ ...prev, activity: true }));
    } catch (err) {
      console.error('Error loading activity:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, activity: false }));
    }
  };

  // Lazy-load payment tab
  const loadPaymentTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.payment) return;

    try {
      setLoadingTabs(prev => ({ ...prev, payment: true }));
      const response = await voucherAPI.getPayment(user.businessId, billId);
      setPaymentData(response as VoucherPaymentResponseAPI);
      setLoadedTabs(prev => ({ ...prev, payment: true }));
    } catch (err) {
      console.error('Error loading payment:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, payment: false }));
    }
  };

  // Lazy-load accounting tab
  const loadAccountingTab = async () => {
    if (!billId || !user?.businessId || loadedTabs.accounting) return;

    try {
      setLoadingTabs(prev => ({ ...prev, accounting: true }));
      const response = await voucherAPI.getAccounting(user.businessId, billId);
      setAccountingData(response as VoucherAccountingResponseAPI);
      setLoadedTabs(prev => ({ ...prev, accounting: true }));
    } catch (err) {
      console.error('Error loading accounting:', err);
    } finally {
      setLoadingTabs(prev => ({ ...prev, accounting: false }));
    }
  };


  // OCR helper functions
  const getOcrConfidence = (field: string): number => {
    const confidences: { [key: string]: number } = {
      vendorName: 0.95,
      invoiceNumber: 0.92,
      amount: 0.89,
      dueDate: 0.87,
      billDate: 0.91,
      gstin: 0.78,
      items: 0.85
    };
    return confidences[field] || 0.8;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle className="h-3 w-3 text-green-600" />;
    if (confidence >= 0.7) return <AlertTriangle className="h-3 w-3 text-yellow-600" />;
    return <AlertCircle className="h-3 w-3 text-red-600" />;
  };

  const getStatusColor = (voucherStatus: string) => {
    switch (voucherStatus) {
      case 'draft':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finalized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'posted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'synced':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (voucherStatus: string) => {
    switch (voucherStatus) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'finalized':
        return <CheckCircle className="h-4 w-4" />;
      case 'posted':
        return <Calendar className="h-4 w-4" />;
      case 'synced':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (paymentStatus: string | null) => {
    switch (paymentStatus) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPaymentStatusIcon = (paymentStatus: string | null) => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3" />;
      case 'cancelled':
        return <X className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getPaymentStatusLabel = (paymentStatus: string | null) => {
    switch (paymentStatus) {
      case 'success':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unpaid';
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bill details...</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Bill not found'}</p>
          <Button onClick={() => navigate('/bills')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bills
          </Button>
        </div>
      </div>
    );
  }

  // Show Pay button only if payment is not successful and voucher is not synced
  const canPay = bill.paymentStatus !== 'success' && bill.voucherStatus !== 'synced';

  // Bill is overdue if payment not successful and due date has passed
  const isOverdue = () => {
    if (bill.paymentStatus === 'success') return false;
    if (!bill.dueDate) return false;
    const dueDate = new Date(bill.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Show Delete button only if voucher status is 'draft'
  const canDelete = bill.voucherStatus === 'draft';

  // Show Edit button only if voucher status is 'draft'
  const canEdit = bill.voucherStatus === 'draft';

  // Handle delete bill
  const handleDeleteBill = async () => {
    if (!billId || !user?.businessId) return;

    try {
      setIsDeleting(true);
      await voucherAPI.deleteVoucher(user.businessId, billId);
      toast.success("Bill deleted successfully");
      // Navigate back to bills list
      navigate('/bills');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete bill';
      toast.error(errorMessage);
      console.error('Error deleting bill:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle approval request
  const handleRequestApproval = async () => {
    if (!billId || !user?.businessId || !user?.id) return;

    try {
      setIsRequestingApproval(true);
      await voucherAPI.requestApproval(user.businessId, billId, user.id);
      toast.success("Approval request sent successfully");

      // Update local bill state to reflect pending approval
      setBill(prevBill => prevBill ? { ...prevBill, approvalStatus: 'pending' } : null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request approval';
      toast.error(errorMessage);
      console.error('Error requesting approval:', err);
    } finally {
      setIsRequestingApproval(false);
    }
  };

  // Save edited bill changes
  const handleSaveBillChanges = async () => {
    if (!editFormData || !originalEditData || !billId || !user?.businessId) return;

    setIsSaving(true);

    try {
      // Helper to round to 2 decimal places
      const round2 = (num: number) => Math.round(num * 100) / 100;

      // Build payload with only changed fields
      const payload: any = {};

      // Check each field for changes
      if (editFormData.invoiceNumber !== originalEditData.invoiceNumber) {
        payload.invoice_number = editFormData.invoiceNumber;
      }

      if (editFormData.billDate !== originalEditData.billDate) {
        payload.invoice_date = editFormData.billDate;
      }

      if (editFormData.dueDate !== originalEditData.dueDate) {
        payload.invoice_due_date = editFormData.dueDate;
      }

      if (editFormData.vendorReferenceNumber !== originalEditData.vendorReferenceNumber) {
        payload.vendor_reference_number = editFormData.vendorReferenceNumber;
      }

      if (editFormData.expenseCategory !== originalEditData.expenseCategory) {
        payload.expense_category = editFormData.expenseCategory;
      }

      if (editFormData.description !== originalEditData.description) {
        payload.description = editFormData.description;
      }

      if (editFormData.paymentTerms !== originalEditData.paymentTerms) {
        payload.payment_terms = editFormData.paymentTerms;
      }

      // Check if line items changed
      const itemsChanged = JSON.stringify(editFormData.items) !== JSON.stringify(originalEditData.items);

      // Check if GST type changed
      const gstTypeChanged = editFormData.gstType !== originalEditData.gstType;

      // Check if discount changed
      const discountChanged =
        editFormData.discountType !== originalEditData.discountType ||
        editFormData.discountValue !== originalEditData.discountValue;

      // Check if round-off changed
      const roundOffChanged = editFormData.roundOff !== originalEditData.roundOff;

      // If any financial data changed, include all financial fields
      if (itemsChanged || gstTypeChanged || discountChanged || roundOffChanged) {
        // Financial details JSONB
        payload.financial_details = {
          line_items: editFormData.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: Math.round(round2(item.rate) * 100), // Convert to paise
            amount: Math.round(round2(item.amount) * 100), // Convert to paise
            gst_rate: item.gst_rate,
            gst_amount: Math.round(round2(item.gst_amount) * 100), // Convert to paise
          })),
          discount: {
            type: editFormData.discountType,
            value: round2(editFormData.discountValue),
            amount: Math.round(round2(editFormData.discountAmount) * 100), // Convert to paise
          },
          round_off: {
            applied: editFormData.roundOff,
            amount: Math.round(round2(editFormData.roundOffAmount) * 100), // Convert to paise
          },
          gst_type: editFormData.gstType,
        };

        // Include all amount fields (convert to paise)
        payload.gross_amount = Math.round(editFormData.grossAmount * 100);
        payload.net_amount = Math.round(editFormData.netAmount * 100);
        payload.cgst_amount = Math.round(editFormData.cgstAmount * 100);
        payload.sgst_amount = Math.round(editFormData.sgstAmount * 100);
        payload.igst_amount = Math.round(editFormData.igstAmount * 100);
        payload.gst_amount = Math.round(editFormData.totalGst * 100);
        payload.discount_amount = Math.round(editFormData.discountAmount * 100);
      }

      // Check if anything changed
      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        setIsEditMode(false);
        return;
      }

      // Call API to update voucher
      await voucherAPI.updateVoucher(user.businessId, billId, payload);

      toast.success("Bill updated successfully");

      // Reload bill data to show updated values
      const response = await voucherAPI.getDetails(user.businessId, billId);
      const voucherResponse = response as VoucherDetailsResponseAPI;
      const mappedBill = mapVoucherToBill(voucherResponse);
      setBill(mappedBill);

      // Exit edit mode
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating bill:", error);
      toast.error("Failed to update bill", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to recalculate all financial values from form data

  const recalculateFromFormData = (data: EditFormData): EditFormData => {
    // Calculate subtotal from items
    const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);

    // Calculate GST totals
    let totalGst = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    data.items.forEach(item => {
      const itemGst = item.gst_amount;
      totalGst += itemGst;

      if (data.gstType === GST_TYPES.CGST_SGST) {
        cgstAmount += itemGst / 2;
        sgstAmount += itemGst / 2;
      } else {
        igstAmount += itemGst;
      }
    });

    const grossAmount = subtotal + totalGst;

    let discountAmount = 0;
    if (data.discountType === 'percentage') {
      discountAmount = (grossAmount * data.discountValue) / 100;
    } else {
      discountAmount = data.discountValue;
    }

    const netAmount = grossAmount - discountAmount;

    let roundOffAmount = 0;
    if (data.roundOff) {
      const rounded = Math.round(netAmount);
      roundOffAmount = rounded - netAmount;
    }

    return {
      ...data,
      subtotal,
      totalGst,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grossAmount,
      discountAmount,
      roundOffAmount,
      netAmount,
    };
  };

  const addNewEditItem = () => {
    if (!editFormData) return;
    const newData = {
      ...editFormData,
      items: [...editFormData.items, {
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
        gst_rate: 18,
        gst_amount: 0
      }]
    };
    setEditFormData(recalculateFromFormData(newData));
  };

  const removeEditItem = (index: number) => {
    if (!editFormData) return;
    const newData = {
      ...editFormData,
      items: editFormData.items.filter((_, i) => i !== index)
    };
    setEditFormData(recalculateFromFormData(newData));
  };

  const updateEditItem = (index: number, field: keyof LineItem, value: any) => {
    if (!editFormData) return;

    const newItems = editFormData.items.map((item, i) => {
      if (i === index) {
        const updated = { ...item, [field]: value };

        // Auto-calculate dependent fields
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        if (field === 'quantity' || field === 'rate' || field === 'gst_rate') {
          updated.gst_amount = (updated.amount * updated.gst_rate) / 100;
        }

        return updated;
      }
      return item;
    });

    const newData = { ...editFormData, items: newItems };
    setEditFormData(recalculateFromFormData(newData));
  };

  const getGstBreakdown = () => {
    if (!editFormData) return {};
    const breakdown: Record<number, { amount: number, gst: number }> = {};

    editFormData.items.forEach(item => {
      const rate = item.gst_rate;
      if (!breakdown[rate]) {
        breakdown[rate] = { amount: 0, gst: 0 };
      }
      breakdown[rate].amount += item.amount;
      breakdown[rate].gst += item.gst_amount;
    });

    return breakdown;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/bills')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold">Invoice {bill.invoiceNumber}</h1>
              <div className="flex items-center gap-2 mt-1">
                {bill.voucherStatus && (
                  <Badge variant="outline" className={getStatusColor(bill.voucherStatus)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(bill.voucherStatus)}
                      {bill.voucherStatus.charAt(0).toUpperCase() + bill.voucherStatus.slice(1)}
                    </span>
                  </Badge>
                )}
                <Badge variant="outline" className={getPaymentStatusColor(bill.paymentStatus)}>
                  <span className="flex items-center gap-1">
                    {getPaymentStatusIcon(bill.paymentStatus)}
                    {getPaymentStatusLabel(bill.paymentStatus)}
                  </span>
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>OCR Parsed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Approval Button - Only shown for non-owner roles */}
            {user?.role !== 'owner' && (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                disabled={bill.approvalStatus === 'pending' || isRequestingApproval}
                onClick={handleRequestApproval}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isRequestingApproval ? 'Requesting...' : bill.approvalStatus === 'pending' ? 'Pending for Approval' : 'Ask for Approval'}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Bill Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {canPay && (
                  <DropdownMenuItem onClick={() => {/* TODO: Handle pay now */}}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    {isOverdue ? "Pay Overdue Bill" : "Pay Now"}
                  </DropdownMenuItem>
                )}

                {canEdit && (
                  <DropdownMenuItem onClick={() => setIsEditMode(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Bill
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem onClick={() => {/* TODO: Handle download */}}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </DropdownMenuItem>

                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Bill
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this bill?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bill
              <span className="font-semibold"> {bill.invoiceNumber} </span>
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBill}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete Bill"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Edit Mode UI */}
          {isEditMode && editFormData ? (
            <div className="space-y-6">
              {/* Payee Information - Read Only */}
              <Card>
                <CardContent className="pt-6">
                  <Label className="text-base font-medium">Payee (Cannot be changed)</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/30 mt-3">
                    {bill.payeeType === 'employee' || bill.payeeType === 'salary' ? (
                      <User className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{bill.vendorName}</p>
                      {bill.vendorGstin && (
                        <p className="text-sm text-muted-foreground">GSTIN: {bill.vendorGstin}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-medium mb-4">Invoice Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                      <Input
                        id="invoiceNumber"
                        value={editFormData.invoiceNumber}
                        onChange={(e) => setEditFormData({...editFormData, invoiceNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="vendorReferenceNumber">Vendor Reference / PO Number</Label>
                      <Input
                        id="vendorReferenceNumber"
                        value={editFormData.vendorReferenceNumber}
                        onChange={(e) => setEditFormData({...editFormData, vendorReferenceNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="billDate">Invoice Date *</Label>
                      <Input
                        id="billDate"
                        type="date"
                        value={editFormData.billDate}
                        onChange={(e) => setEditFormData({...editFormData, billDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={editFormData.dueDate}
                        onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expenseCategory">Expense Category *</Label>
                      <Select
                        value={editFormData.expenseCategory}
                        onValueChange={(value) => setEditFormData({...editFormData, expenseCategory: value})}
                      >
                        <SelectTrigger id="expenseCategory">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select
                        value={editFormData.paymentTerms}
                        onValueChange={(value) => setEditFormData({...editFormData, paymentTerms: value})}
                      >
                        <SelectTrigger id="paymentTerms">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_TERMS.map(term => (
                            <SelectItem key={term.value} value={term.value}>
                              {term.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description / Notes</Label>
                    <Textarea
                      id="description"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* GST Configuration */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-medium mb-4">GST Configuration</h3>
                  <RadioGroup
                    value={editFormData.gstType}
                    onValueChange={(value: GSTType) => setEditFormData(recalculateFromFormData({...editFormData, gstType: value}))}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={GST_TYPES.CGST_SGST} id="cgst_sgst" />
                      <Label htmlFor="cgst_sgst" className="font-normal cursor-pointer">
                        CGST + SGST (Intra-state)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={GST_TYPES.IGST} id="igst" />
                      <Label htmlFor="igst" className="font-normal cursor-pointer">
                        IGST (Inter-state)
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Line Items */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-medium mb-4">Line Items *</h3>
                  <div className="space-y-4">
                    {editFormData.items.map((item, index) => (
                      <Card key={index} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Item {index + 1}</h4>
                            <Button variant="ghost" size="icon" onClick={() => removeEditItem(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label>Description *</Label>
                              <Input
                                value={item.description}
                                onChange={(e) => updateEditItem(index, 'description', e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              <div>
                                <Label>Quantity *</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={item.quantity}
                                  onChange={(e) => updateEditItem(index, 'quantity', Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label>Rate *</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.rate}
                                  onChange={(e) => updateEditItem(index, 'rate', Number(e.target.value))}
                                />
                              </div>
                              <div>
                                <Label>Amount</Label>
                                <Input
                                  type="number"
                                  value={item.amount.toFixed(2)}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>
                              <div>
                                <Label>GST Rate *</Label>
                                <Select
                                  value={String(item.gst_rate)}
                                  onValueChange={(value) => updateEditItem(index, 'gst_rate', Number(value))}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GST_RATES.map(rate => (
                                      <SelectItem key={rate.value} value={String(rate.value)}>
                                        {rate.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>GST Amount</Label>
                                <Input
                                  type="number"
                                  value={item.gst_amount.toFixed(2)}
                                  readOnly
                                  className="bg-muted"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button variant="outline" onClick={addNewEditItem} className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Line Item
                  </Button>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-medium mb-4">Bill Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">₹ {editFormData.subtotal.toFixed(2)}</span>
                    </div>

                    {editFormData.gstType === GST_TYPES.CGST_SGST ? (
                      <>
                        {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                          <div key={rate} className="text-sm space-y-1">
                            <div className="flex justify-between text-muted-foreground">
                              <span>CGST @ {Number(rate) / 2}%</span>
                              <span>₹ {(data.gst / 2).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                              <span>SGST @ {Number(rate) / 2}%</span>
                              <span>₹ {(data.gst / 2).toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {Object.entries(getGstBreakdown()).map(([rate, data]) => (
                          <div key={rate} className="flex justify-between text-sm text-muted-foreground">
                            <span>IGST @ {rate}%</span>
                            <span>₹ {data.gst.toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}

                    <Separator />

                    <div className="flex justify-between text-sm font-medium">
                      <span>Gross Amount</span>
                      <span>₹ {editFormData.grossAmount.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex-1">Discount</span>
                      <Select
                        value={editFormData.discountType}
                        onValueChange={(value: 'amount' | 'percentage') =>
                          setEditFormData(recalculateFromFormData({...editFormData, discountType: value}))
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">%</SelectItem>
                          <SelectItem value="amount">₹</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        className="w-24 text-right"
                        type="number"
                        min="0"
                        value={editFormData.discountValue}
                        onChange={(e) => setEditFormData(recalculateFromFormData({...editFormData, discountValue: Number(e.target.value)}))}
                      />
                      <span className="w-24 text-right font-medium">₹ {editFormData.discountAmount.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm font-medium">
                      <span>Net Amount</span>
                      <span>₹ {editFormData.netAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        id="roundOff"
                        checked={editFormData.roundOff}
                        onChange={(e) => setEditFormData(recalculateFromFormData({...editFormData, roundOff: e.target.checked}))}
                        className="rounded"
                      />
                      <Label htmlFor="roundOff" className="font-normal cursor-pointer flex-1">
                        Apply round off
                      </Label>
                      {editFormData.roundOff && (
                        <span className="font-medium">
                          {(editFormData.roundOffAmount >= 0 ? '+' : '') + editFormData.roundOffAmount.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Final Payable Amount</span>
                      <span>₹ {(editFormData.netAmount + editFormData.roundOffAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBillChanges}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <>

          {/* Hero Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  {/* Conditional rendering based on payee type */}
                  {bill.payeeType === 'employee' || bill.payeeType === 'salary' ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Employee</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{bill.vendorName}</h2>
                      </div>
                      {/* Bank Account Details */}
                      <div className="mt-3 space-y-1.5">
                        {bill.payeeBankAccountMasked && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Account:</span>
                            <span className="ml-2 font-medium">{bill.payeeBankAccountMasked}</span>
                          </div>
                        )}
                        {bill.payeeIfscCode && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">IFSC:</span>
                            <span className="ml-2 font-medium">{bill.payeeIfscCode}</span>
                          </div>
                        )}
                        {bill.payeeBankName && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Bank:</span>
                            <span className="ml-2 font-medium">{bill.payeeBankName}</span>
                          </div>
                        )}
                        {bill.payeeAccountType && (
                          <div className="text-sm">
                            <Badge variant="outline" className="capitalize">
                              {bill.payeeAccountType}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Vendor</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold">{bill.vendorName}</h2>
                        <div className="flex items-center gap-1">
                          {getConfidenceIcon(getOcrConfidence('vendorName'))}
                          <span className={`text-xs ${getConfidenceColor(getOcrConfidence('vendorName'))}`}>
                            {Math.round(getOcrConfidence('vendorName') * 100)}%
                          </span>
                        </div>
                      </div>
                      {bill.vendorGstin && (
                        <p className="text-sm text-muted-foreground">GSTIN: {bill.vendorGstin}</p>
                      )}
                      {bill.vendorAddress && (
                        <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{bill.vendorAddress}</p>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Dates</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Bill Date:</span>
                      <span className="ml-2 font-medium">{formatPaymentDate(bill.billDate)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className={`ml-2 font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                        {formatPaymentDate(bill.dueDate)}
                        {isOverdue && bill.overdueDays && (
                          <span className="text-xs ml-1">({bill.overdueDays}d overdue)</span>
                        )}
                      </span>
                    </div>
                    {bill.terms && (
                      <div>
                        <span className="text-muted-foreground">Terms:</span>
                        <span className="ml-2 font-medium">{bill.terms}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Amount</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-primary">{formatCurrency(bill.amount)}</div>
                    <div className="flex items-center gap-1">
                      {getConfidenceIcon(getOcrConfidence('amount'))}
                      <span className={`text-xs ${getConfidenceColor(getOcrConfidence('amount'))}`}>
                        {Math.round(getOcrConfidence('amount') * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs
            defaultValue="details"
            className="w-full"
            onValueChange={(value) => {
              // Lazy-load tab data when user clicks on it
              if (value === 'activity') loadActivityTab();
              if (value === 'payment') loadPaymentTab();
              if (value === 'accounting') loadAccountingTab();
            }}
          >
            <TabsList className={`grid w-full ${(() => {
              const showERP = canViewFeature('ERP_INTEGRATION', user);
              const showPayment = voucherPaymentStatus === 'success'; // Only show Payment tab if paid
              const showAttachments = attachments.length > 0;

              let cols = 2; // Details, Activity (always visible)
              if (showPayment) cols++; // Add Payment tab if paid
              if (showERP) cols++;
              if (showAttachments) cols++;

              return `grid-cols-${cols}`;
            })()}`}>
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                Activity
              </TabsTrigger>
              {voucherPaymentStatus === 'success' && (
                <TabsTrigger value="payment">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment
                </TabsTrigger>
              )}
              {canViewFeature('ERP_INTEGRATION', user) && (
                <TabsTrigger value="accounting">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Accounting
                </TabsTrigger>
              )}
              {attachments.length > 0 && (
                <TabsTrigger value="attachments">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attachments
                </TabsTrigger>
              )}
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Conditional rendering based on payee type */}
              {bill.payeeType === 'employee' || bill.payeeType === 'salary' ? (
                /* Salary Details Card for Employee */
                <Card>
                  <CardHeader>
                    <CardTitle>Salary Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Description */}
                      {bill.description && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-base font-medium">{bill.description}</p>
                        </div>
                      )}

                      {/* Expense Category Badge */}
                      {bill.expenseCategory && (
                        <div>
                          <Badge variant="outline" className="capitalize">
                            {bill.expenseCategory}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                /* Line Items for Vendor/Biller */
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Line Items</CardTitle>
                      <div className="flex items-center gap-1">
                        {getConfidenceIcon(getOcrConfidence('items'))}
                        <span className={`text-xs ${getConfidenceColor(getOcrConfidence('items'))}`}>
                          OCR {Math.round(getOcrConfidence('items') * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b">
                          <tr>
                            <th className="text-left py-3 px-2 font-medium">Description</th>
                            <th className="text-right py-3 px-2 font-medium">Qty</th>
                            <th className="text-right py-3 px-2 font-medium">Rate</th>
                            <th className="text-right py-3 px-2 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3 px-2">{item.description}</td>
                              <td className="text-right py-3 px-2">{item.quantity}</td>
                              <td className="text-right py-3 px-2">{formatCurrency(item.rate)}</td>
                              <td className="text-right py-3 px-2 font-medium">{formatCurrency(item.amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Financial Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {bill.payeeType === 'employee' || bill.payeeType === 'salary'
                      ? 'Salary Breakdown'
                      : 'Financial Breakdown'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bill.payeeType === 'employee' || bill.payeeType === 'salary' ? (
                    /* Simplified breakdown for employee */
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Gross Salary</span>
                        <span className="font-medium">{formatCurrency(bill.amount)}</span>
                      </div>
                      {bill.tdsAmount && bill.tdsAmount > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">TDS Deduction</span>
                          <span className="font-medium text-red-600">- {formatCurrency(bill.tdsAmount)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold">Net Salary</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(bill.amount - (bill.tdsAmount || 0))}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Standard breakdown for vendor/biller */
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                      </div>
                      {bill.cgst > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">CGST</span>
                          <span className="font-medium">{formatCurrency(bill.cgst)}</span>
                        </div>
                      )}
                      {bill.sgst > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">SGST</span>
                          <span className="font-medium">{formatCurrency(bill.sgst)}</span>
                        </div>
                      )}
                      {bill.igst > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">IGST</span>
                          <span className="font-medium">{formatCurrency(bill.igst)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-lg font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(bill.amount)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTabs.activity ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : activityData && activityData.activities.length > 0 ? (
                    <div className="space-y-3">
                      {activityData.activities.map((activity, index) => {
                        const eventDisplay = getEventDisplay(activity.action);
                        const EventIcon = eventDisplay.icon;
                        const description = getActivityDescription(activity);

                        return (
                          <div key={activity.activity_id} className="flex gap-3">
                            {/* Timeline dot and line */}
                            <div className="flex flex-col items-center">
                              <div className={`rounded-full p-1.5 bg-background border-2 ${eventDisplay.color.replace('text-', 'border-')}`}>
                                <EventIcon className={`h-3 w-3 ${eventDisplay.color}`} />
                              </div>
                              {index < activityData.activities.length - 1 && (
                                <div className="w-0.5 flex-1 bg-border mt-1 min-h-[20px]" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-3">
                              <div className="flex items-start justify-between mb-1">
                                <div>
                                  <p className="text-sm font-medium">{eventDisplay.label}</p>
                                  <p className="text-xs text-muted-foreground">
                                    by {activity.user_name}
                                  </p>
                                </div>
                                <p className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </p>
                              </div>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Activity className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Activity Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Activity timeline will appear here once events are recorded.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab - Only visible if payment is made */}
            {voucherPaymentStatus === 'success' && (
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment & Payout Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTabs.payment ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : paymentData ? (
                    <div className="space-y-6">
                      {/* Payment Status Banner */}
                      <div className={`border rounded-lg p-4 ${
                        paymentData.payment_status === 'success'
                          ? 'bg-green-50 border-green-200'
                          : paymentData.payment_status === 'pending'
                          ? 'bg-yellow-50 border-yellow-200'
                          : paymentData.payment_status === 'failed'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {paymentData.payment_status === 'success' ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : paymentData.payment_status === 'pending' ? (
                              <Clock className="h-6 w-6 text-yellow-600" />
                            ) : paymentData.payment_status === 'failed' ? (
                              <AlertCircle className="h-6 w-6 text-red-600" />
                            ) : (
                              <Clock className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-semibold ${
                              paymentData.payment_status === 'success'
                                ? 'text-green-900'
                                : paymentData.payment_status === 'pending'
                                ? 'text-yellow-900'
                                : paymentData.payment_status === 'failed'
                                ? 'text-red-900'
                                : 'text-blue-900'
                            }`}>
                              Payment {paymentData.payment_status === 'success' ? 'Completed' : paymentData.payment_status.charAt(0).toUpperCase() + paymentData.payment_status.slice(1)}
                            </h3>
                            <p className={`text-sm ${
                              paymentData.payment_status === 'success'
                                ? 'text-green-700'
                                : paymentData.payment_status === 'pending'
                                ? 'text-yellow-700'
                                : paymentData.payment_status === 'failed'
                                ? 'text-red-700'
                                : 'text-blue-700'
                            }`}>
                              This bill was paid on {format(new Date(paymentData.payment_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment ID</p>
                          <p className="font-mono font-medium text-sm">{paymentData.payment_id}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Voucher Number</p>
                          <p className="font-mono font-medium">{paymentData.voucher_number}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment Gateway</p>
                          <p className="font-medium capitalize">{paymentData.gateway_used}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p className="font-medium capitalize">{paymentData.payment_method}</p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Payment Date</p>
                          <p className="font-medium">
                            {format(new Date(paymentData.payment_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>

                        {paymentData.payment_source_type === 'card' && paymentData.last_four_digits && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Card Details</p>
                            <p className="font-medium">
                              {paymentData.card_type?.toUpperCase()} {paymentData.card_category} •••• {paymentData.last_four_digits}
                            </p>
                          </div>
                        )}

                        {paymentData.gateway_payment_id && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Gateway Payment ID</p>
                            <p className="font-mono font-medium text-sm">{paymentData.gateway_payment_id}</p>
                          </div>
                        )}

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Settlement Status</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              paymentData.settlement_status === 'settled'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : paymentData.settlement_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }>
                              {paymentData.settlement_status === 'settled' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {paymentData.settlement_status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                              {paymentData.settlement_status.charAt(0).toUpperCase() + paymentData.settlement_status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {paymentData.settlement_utr && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Settlement UTR</p>
                            <p className="font-mono font-medium">{paymentData.settlement_utr}</p>
                          </div>
                        )}

                        {paymentData.settled_at && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Settled At</p>
                            <p className="font-medium">
                              {format(new Date(paymentData.settled_at), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                        )}

                        {paymentData.settlement_reference_id && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Settlement Reference</p>
                            <p className="font-mono font-medium text-sm">{paymentData.settlement_reference_id}</p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Amount Breakdown */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm">Amount Breakdown</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Voucher Amount</span>
                            <span className="font-medium">{formatCurrency(paymentData.voucher_amount / 100)}</span>
                          </div>

                          {paymentData.convenience_fee > 0 && (
                            <>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Convenience Fee ({paymentData.convenience_fee_rate})
                                </span>
                                <span className="font-medium">{formatCurrency(paymentData.convenience_fee / 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  GST on Fee ({paymentData.gst_rate})
                                </span>
                                <span className="font-medium">{formatCurrency(paymentData.gst_on_fee / 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Fee Amount</span>
                                <span className="font-medium">{formatCurrency(paymentData.total_fee_amount / 100)}</span>
                              </div>
                              <Separator />
                            </>
                          )}

                          <div className="flex justify-between text-base font-semibold">
                            <span>Total Amount Paid</span>
                            <span className="text-primary">{formatCurrency(paymentData.total_amount_paid / 100)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Settlement Information */}
                      {(paymentData.settlement_amount > 0 || paymentData.mdr_amount > 0) && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Settlement Information</h3>
                            <div className="space-y-2 text-sm">
                              {paymentData.settlement_amount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Settlement Amount</span>
                                  <span className="font-medium">{formatCurrency(paymentData.settlement_amount / 100)}</span>
                                </div>
                              )}

                              {paymentData.mdr_amount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    MDR Charges {paymentData.mdr_rate && `(${paymentData.mdr_rate})`}
                                  </span>
                                  <span className="font-medium text-red-600">- {formatCurrency(paymentData.mdr_amount / 100)}</span>
                                </div>
                              )}

                              {paymentData.net_settlement_amount > 0 && (
                                <>
                                  <Separator />
                                  <div className="flex justify-between text-base font-semibold">
                                    <span>Net Settlement Amount</span>
                                    <span className="text-primary">{formatCurrency(paymentData.net_settlement_amount / 100)}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Payment Receipt Button */}
                      <div className="flex justify-end pt-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Receipt
                        </Button>
                      </div>

                      {paymentData.description && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Description</h3>
                            <p className="text-sm text-muted-foreground">{paymentData.description}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Payment Made Yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This bill is still unpaid. Payment details will appear here once processed.
                      </p>
                      {canPay && (
                        <Button>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            )}

            {/* Accounting Tab - Feature Flagged */}
            {canViewFeature('ERP_INTEGRATION', user) && (
              <TabsContent value="accounting" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Accounting & ERP Integration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Mock accounting details - will be replaced with actual API data
                      // const accountingDetails = bill.accounting_details; // From API
                      const mockAccountingDetails = {
                        journal_entry_id: 'JE-' + billId?.slice(0, 8),
                        ledger_account: '5000 - Accounts Payable',
                        cost_center: 'Operations',
                        department: 'Finance',
                        erp_sync_status: 'synced',
                        erp_reference_id: 'ERP-' + Math.random().toString().slice(2, 10),
                        erp_sync_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
                      };

                      const accountingDetails = mockAccountingDetails;

                      if (!accountingDetails) {
                        return (
                          <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                              <BarChart3 className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Accounting Data</h3>
                            <p className="text-sm text-muted-foreground">
                              This bill has not been synced to your ERP system yet.
                            </p>
                          </div>
                        );
                      }

                      const syncStatusColor = {
                        synced: 'bg-green-100 text-green-800 border-green-200',
                        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        failed: 'bg-red-100 text-red-800 border-red-200',
                        not_applicable: 'bg-gray-100 text-gray-800 border-gray-200'
                      }[accountingDetails.erp_sync_status] || 'bg-gray-100 text-gray-800 border-gray-200';

                      const syncStatusIcon = {
                        synced: CheckCircle,
                        pending: Clock,
                        failed: AlertCircle,
                        not_applicable: AlertTriangle
                      }[accountingDetails.erp_sync_status] || Clock;

                      const StatusIcon = syncStatusIcon;

                      return (
                        <div className="space-y-6">
                          {/* ERP Sync Status Banner */}
                          <div className={`border rounded-lg p-4 ${
                            accountingDetails.erp_sync_status === 'synced'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <StatusIcon className={`h-6 w-6 ${
                                  accountingDetails.erp_sync_status === 'synced'
                                    ? 'text-green-600'
                                    : 'text-yellow-600'
                                }`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${
                                  accountingDetails.erp_sync_status === 'synced'
                                    ? 'text-green-900'
                                    : 'text-yellow-900'
                                }`}>
                                  ERP Sync Status: {accountingDetails.erp_sync_status.charAt(0).toUpperCase() +
                                   accountingDetails.erp_sync_status.slice(1)}
                                </h3>
                                {accountingDetails.erp_sync_date && (
                                  <p className={`text-sm ${
                                    accountingDetails.erp_sync_status === 'synced'
                                      ? 'text-green-700'
                                      : 'text-yellow-700'
                                  }`}>
                                    Last synced {formatDistanceToNow(new Date(accountingDetails.erp_sync_date), { addSuffix: true })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Accounting Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Journal Entry ID</p>
                              <p className="font-mono font-medium">{accountingDetails.journal_entry_id}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Ledger Account</p>
                              <p className="font-medium">{accountingDetails.ledger_account}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Cost Center</p>
                              <p className="font-medium">{accountingDetails.cost_center}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Department</p>
                              <p className="font-medium">{accountingDetails.department}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">ERP Reference ID</p>
                              <p className="font-mono font-medium">{accountingDetails.erp_reference_id}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Sync Date</p>
                              <p className="font-medium">
                                {format(new Date(accountingDetails.erp_sync_date), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>

                          <Separator />

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium mb-1">ERP Actions</p>
                              <p className="text-xs text-muted-foreground">
                                Manage this bill's integration with your ERP system
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View in ERP System
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Attachments Tab - Only shown if attachments exist */}
            {attachments.length > 0 && (
              <TabsContent value="attachments" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Helper to format file size */}
                    {(() => {
                      const formatFileSize = (bytes: number) => {
                        if (bytes < 1024) return bytes + ' B';
                        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
                        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
                      };

                      const getFileIcon = (fileType: string) => {
                        if (fileType.includes('pdf')) return FileText;
                        if (fileType.includes('image')) return FileText;
                        return FileText;
                      };

                      return (
                        <div className="space-y-3">
                          {attachments.map((attachment) => {
                            const FileIcon = getFileIcon(attachment.file_type);

                            return (
                              <div
                                key={attachment.attachment_id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <FileIcon className="h-5 w-5 text-primary" />
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{attachment.file_name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                      <span>{formatFileSize(attachment.file_size)}</span>
                                      <span>•</span>
                                      <span>Uploaded {formatPaymentDate(attachment.uploaded_date)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillDetailPage;
