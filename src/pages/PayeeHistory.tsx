import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Building2, CreditCard, Edit, Save, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Payee, BankPayee, BillerPayee, PayrollPayee } from "@/types/payee";
import { TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";
import { usePayeeDetails } from "@/hooks/usePayeeDetails";
import { usePayeeTransactions } from "@/hooks/usePayeeTransactions";

// Import refactored components
import { DownloadActions } from "@/components/payee-history/DownloadActions";
// Use payee-specific TransactionsTable (no vendor column, no category, includes description)
import TransactionsTable from "@/components/payee-history/TransactionsTable";
const PayeeHistory = () => {
  const {payeeId} = useParams<{payeeId: string;}>();
  const navigate = useNavigate();

  // Use server-side hook for payee overview data
  const {
    overview,
    isLoading: isLoadingOverview,
    error: overviewError,
    updatePayeeDetails,
    validateIfsc
  } = usePayeeDetails(payeeId || "");

  // Transaction history state for the main TransactionsTable
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionFilters, setTransactionFilters] = useState({
    status: 'all' as TransactionStatus | 'all',
    paymentMethod: 'all' as PaymentMethod | 'all',
    dateRange: undefined as DateRange | undefined,
    page: 1,
    limit: 10,
    sortBy: 'date' as 'date' | 'amount' | 'status' | 'method',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [searchValue, setSearchValue] = useState("");

  // Use server-side hook for payee transactions - only when history tab is active
  const {
    transactions,
    pagination: transactionPagination,
    appliedFilters: transactionAppliedFilters,
    isLoading: isLoadingTransactions,
    error: transactionError
  } = usePayeeTransactions(
    payeeId || "",
    activeTab === "history" ? transactionFilters : { ...transactionFilters, page: 0, limit: 0 } // Don't load until history tab
  );

  // Edit state management
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);

  // Form data for editing
  const [editData, setEditData] = useState({
    email: "",
    contactNumber: "",
    accountNumber: "",
    ifscCode: "",
    bankName: ""
  });

  // Transaction table handlers
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setTransactionFilters(prev => ({ ...prev, limit: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setTransactionFilters(prev => ({ ...prev, page }));
  };

  const handleSortChange = (column: 'date' | 'amount' | 'vendor' | 'status') => {
    setTransactionFilters(prev => ({
      ...prev,
      sortBy: column === 'vendor' ? 'date' : column, // Map vendor to date for now
      sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1
    }));
  };

  const handleStatusFilterChange = (statuses: string[]) => {
    const status = statuses.length === 0 ? 'all' : statuses[0] as TransactionStatus;
    setTransactionFilters(prev => ({ ...prev, status, page: 1 }));
  };

  const handlePaymentMethodFilterChange = (methods: string[]) => {
    const paymentMethod = methods.length === 0 ? 'all' : methods[0] as PaymentMethod;
    setTransactionFilters(prev => ({ ...prev, paymentMethod, page: 1 }));
  };

  const handleDateRangeChange = (range: 'last7days' | 'last30days' | 'last3months' | 'custom') => {
    // TODO: Convert range to DateRange format
    console.log('Date range changed:', range);
    setTransactionFilters(prev => ({ ...prev, page: 1 }));
  };

  // Initialize edit data when overview data loads
  useEffect(() => {
    if (overview?.payee) {
      const payee = overview.payee;

      // Initialize edit data based on payee type
      if (payee.type === 'bank') {
        const bankPayee = payee as BankPayee;
        setEditData({
          email: bankPayee.email,
          contactNumber: bankPayee.contactNumber,
          accountNumber: bankPayee.accountNumber,
          ifscCode: bankPayee.ifscCode || "",
          bankName: bankPayee.bankName
        });
      } else if (payee.type === 'payroll') {
        const payrollPayee = payee as PayrollPayee;
        setEditData({
          email: payrollPayee.email,
          contactNumber: payrollPayee.contactNumber,
          accountNumber: payrollPayee.accountNumber,
          ifscCode: payrollPayee.ifscCode || "",
          bankName: payrollPayee.bankName
        });
      } else if (payee.type === 'biller') {
        const billerPayee = payee as BillerPayee;
        setEditData({
          email: billerPayee.email,
          contactNumber: billerPayee.contactNumber,
          accountNumber: "",
          ifscCode: "",
          bankName: ""
        });
      }
    }
  }, [overview]);

  // Totals now come from overview hook data
  
  // IFSC validation using hook
  const handleIfscValidation = async (ifsc: string) => {
    if (ifsc.length !== 11) {
      setIfscValid(false);
      return;
    }

    setIsValidatingIfsc(true);
    try {
      const result = await validateIfsc(ifsc);
      if (result.valid && result.bankName) {
        setEditData(prev => ({ ...prev, bankName: result.bankName! }));
        setIfscValid(true);
      } else {
        setIfscValid(false);
      }
    } catch (error) {
      setIfscValid(false);
    } finally {
      setIsValidatingIfsc(false);
    }
  };
  
  // Handle IFSC change
  const handleIfscChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setEditData(prev => ({ ...prev, ifscCode: upperValue }));

    if (upperValue.length === 11) {
      handleIfscValidation(upperValue);
    } else {
      setIfscValid(null);
      setEditData(prev => ({ ...prev, bankName: "" }));
    }
  };
  
  // Handle save using hook
  const handleSave = async (section: 'company' | 'bank') => {
    try {
      // Prepare updates based on section
      let updates: any = {};

      if (section === 'company') {
        updates.email = editData.email;
        updates.contactNumber = editData.contactNumber;
      } else if (section === 'bank') {
        // Bank-specific fields for BankPayee and PayrollPayee
        updates.accountNumber = editData.accountNumber;
        updates.ifscCode = editData.ifscCode;
        updates.bankName = editData.bankName;
      }

      await updatePayeeDetails(updates);

      // Close edit mode on success
      if (section === 'company') {
        setIsEditingCompany(false);
      } else {
        setIsEditingBank(false);
      }
    } catch (error) {
      console.error(`Error saving ${section} data:`, error);
      // TODO: Show error toast
    }
  };
  
  // Handle cancel
  const handleCancel = (section: 'company' | 'bank') => {
    if (section === 'company') {
      setIsEditingCompany(false);
    } else {
      setIsEditingBank(false);
    }

    // Reset edit data to original values from overview
    if (overview?.payee) {
      const payee = overview.payee;
      if (payee.type === 'bank') {
        const bankPayee = payee as BankPayee;
        setEditData({
          email: bankPayee.email,
          contactNumber: bankPayee.contactNumber,
          accountNumber: bankPayee.accountNumber,
          ifscCode: bankPayee.ifscCode || "",
          bankName: bankPayee.bankName
        });
      } else if (payee.type === 'payroll') {
        const payrollPayee = payee as PayrollPayee;
        setEditData({
          email: payrollPayee.email,
          contactNumber: payrollPayee.contactNumber,
          accountNumber: payrollPayee.accountNumber,
          ifscCode: payrollPayee.ifscCode || "",
          bankName: payrollPayee.bankName
        });
      } else if (payee.type === 'biller') {
        const billerPayee = payee as BillerPayee;
        setEditData({
          email: billerPayee.email,
          contactNumber: billerPayee.contactNumber,
          accountNumber: "",
          ifscCode: "",
          bankName: ""
        });
      }
    }
  };
  // Helper function to get company details
  const getCompanyDetails = () => {
    if (!overview?.payee) return [];

    const payee = overview.payee;
    
    switch (payee.type) {
      case 'bank':
        const bankPayee = payee as BankPayee;
        return [
          { icon: Building2, label: "Company Name", value: bankPayee.name, editable: false },
          { icon: CreditCard, label: "GST Number", value: bankPayee.gstin || "Not provided", editable: false },
          { icon: MapPin, label: "Address", value: "Head Office, Business District", editable: false },
          { icon: Phone, label: "Contact Number", value: isEditingCompany ? editData.contactNumber : bankPayee.contactNumber, editable: true },
          { icon: Mail, label: "Email", value: isEditingCompany ? editData.email : bankPayee.email, editable: true }
        ];
      case 'biller':
        const billerPayee = payee as BillerPayee;
        return [
          { icon: Building2, label: "Biller Name", value: billerPayee.billerName, editable: false },
          { icon: CreditCard, label: "Customer ID", value: billerPayee.customerId, editable: false },
          { icon: Phone, label: "Contact Number", value: isEditingCompany ? editData.contactNumber : billerPayee.contactNumber, editable: true },
          { icon: Mail, label: "Email", value: isEditingCompany ? editData.email : billerPayee.email, editable: true }
        ];
      case 'payroll':
        const payrollPayee = payee as PayrollPayee;
        return [
          { icon: Building2, label: "Employee Name", value: payrollPayee.name, editable: false },
          { icon: Phone, label: "Contact Number", value: isEditingCompany ? editData.contactNumber : payrollPayee.contactNumber, editable: true },
          { icon: Mail, label: "Email", value: isEditingCompany ? editData.email : payrollPayee.email, editable: true }
        ];
      default:
        return [];
    }
  };
  
  // Helper function to get bank details
  const getBankDetails = () => {
    if (!overview?.payee || overview.payee.type === 'biller') return [];

    const payee = overview.payee;
    if (payee.type === 'bank') {
      const bankPayee = payee as BankPayee;
      return [
        { icon: CreditCard, label: "Account Number", value: isEditingBank ? editData.accountNumber : bankPayee.accountNumber, editable: true },
        { icon: CreditCard, label: "IFSC Code", value: isEditingBank ? editData.ifscCode : (bankPayee.ifscCode || "Not provided"), editable: true },
        { icon: Building2, label: "Bank Name", value: isEditingBank ? editData.bankName : bankPayee.bankName, editable: false }
      ];
    } else if (payee.type === 'payroll') {
      const payrollPayee = payee as PayrollPayee;
      return [
        { icon: CreditCard, label: "Account Number", value: isEditingBank ? editData.accountNumber : payrollPayee.accountNumber, editable: true },
        { icon: CreditCard, label: "IFSC Code", value: isEditingBank ? editData.ifscCode : (payrollPayee.ifscCode || "Not provided"), editable: true },
        { icon: Building2, label: "Bank Name", value: isEditingBank ? editData.bankName : payrollPayee.bankName, editable: false },
        { icon: CreditCard, label: "Salary Amount", value: `₹${payrollPayee.salaryAmount.toLocaleString()}`, editable: false }
      ];
    }
    
    return [];
  };

  // Only show error if overview fails to load
  if (overviewError && !overview?.payee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Payee not found</h2>
        <p className="text-muted-foreground mt-2">
          {overviewError || "The payee you are looking for does not exist."}
        </p>
        <Button className="mt-4" onClick={() => navigate("/payees")}>
          Back to Payees
        </Button>
      </div>
    );
  }

  const companyDetails = getCompanyDetails();
  const bankDetails = getBankDetails();

  return <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground" onClick={() => navigate("/payees")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Payees
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {overview?.payee?.name || "Loading..."}
            </h1>
            <p className="text-muted-foreground text-sm mt-1 capitalize">
              {overview?.payee?.type ? `${overview.payee.type} Payee` : "Payee Details"}
            </p>
          </div>
          {overview?.payee && (
            <DownloadActions payeeName={overview.payee.name} />
          )}
        </div>
      </div>
      
      {/* Tab-based Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="inline-flex bg-transparent p-0 h-auto gap-8">
          <TabsTrigger 
            value="overview" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="relative rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            Payment History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Overview loading state */}
          {isLoadingOverview ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Loading payee overview...</h3>
              <p className="text-muted-foreground mt-2">Please wait while we fetch the payee details.</p>
            </div>
          ) : overview?.payee ? (
            <>
              {/* Company Details Section */}
              <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-foreground">Company Details</h3>
                <div className="flex items-center gap-2">
                  {isEditingCompany ? (
                    <>
                      <Button 
                        onClick={() => handleSave('company')}
                        size="sm"
                        className="h-8"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        onClick={() => handleCancel('company')}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={() => setIsEditingCompany(true)}
                      variant="outline"
                      size="sm"
                      className="h-8"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companyDetails.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm text-muted-foreground mb-1">{item.label}</Label>
                      {isEditingCompany && item.editable ? (
                        <Input
                          value={item.value}
                          onChange={(e) => {
                            if (item.label === "Email") {
                              setEditData(prev => ({ ...prev, email: e.target.value }));
                            } else if (item.label === "Contact Number") {
                              setEditData(prev => ({ ...prev, contactNumber: e.target.value }));
                            }
                          }}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <p className="text-sm font-medium text-foreground break-words mt-1">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Bank Details Section - Only for bank and payroll payees */}
          {bankDetails.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-foreground">Bank Details</h3>
                  <div className="flex items-center gap-2">
                    {isEditingBank ? (
                      <>
                        <Button 
                          onClick={() => handleSave('bank')}
                          size="sm"
                          className="h-8"
                          disabled={isValidatingIfsc || (editData.ifscCode && ifscValid === false)}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button 
                          onClick={() => handleCancel('bank')}
                          variant="outline"
                          size="sm"
                          className="h-8"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setIsEditingBank(true)}
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bankDetails.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Label className="text-sm text-muted-foreground mb-1">{item.label}</Label>
                        {isEditingBank && item.editable ? (
                          <div className="relative">
                            <Input
                              value={item.value}
                              onChange={(e) => {
                                if (item.label === "Account Number") {
                                  setEditData(prev => ({ ...prev, accountNumber: e.target.value }));
                                } else if (item.label === "IFSC Code") {
                                  handleIfscChange(e.target.value);
                                }
                              }}
                              className={`h-8 text-sm ${item.label === "IFSC Code" && ifscValid === true ? "border-green-500" : ""}`}
                            />
                            {item.label === "IFSC Code" && (
                              <>
                                {isValidatingIfsc && (
                                  <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                {ifscValid === true && (
                                  <CheckCircle className="absolute right-2 top-2 h-4 w-4 text-green-500" />
                                )}
                              </>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm font-medium text-foreground break-words mt-1">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
            </>
          ) : (
            <div className="p-8 text-center">
              <h3 className="text-lg font-semibold">Unable to load payee details</h3>
              <p className="text-muted-foreground mt-2">
                {overviewError || "There was an error loading the payee information."}
              </p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {/* Loading state for transactions */}
          {isLoadingTransactions ? (
            <div className="p-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading transaction history...</p>
            </div>
          ) : transactionError ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-4">{transactionError}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          ) : (
            /* Transactions Table with inline column filters */
            <TransactionsTable
              transactions={transactions}
              pagination={transactionPagination}
              appliedFilters={transactionAppliedFilters}
              searchValue={searchValue}
              onSearchChange={handleSearchChange}
              itemsPerPage={transactionFilters.limit}
              onItemsPerPageChange={handleItemsPerPageChange}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              onDateRangeChange={handleDateRangeChange}
              onStatusFilterChange={handleStatusFilterChange}
              onPaymentMethodFilterChange={handlePaymentMethodFilterChange}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>;
};
export default PayeeHistory;