import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, MapPin, Phone, Mail, Building2, CreditCard, Edit, Save, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockPayees } from "@/data/mockPayees";
import { getPayeeTransactions, getPayeeTotalPayments, getPayeeLastTransactionDate } from "@/data/mockPayeeTransactions";
import { Payee, BankPayee, BillerPayee, PayrollPayee } from "@/types/payee";
import { Transaction, TransactionStatus, PaymentMethod } from "@/types/transaction";
import { DateRange } from "react-day-picker";

// Import refactored components
import { FilterCard } from "@/components/payee-history/FilterCard";
import { TransactionsTable } from "@/components/payee-history/TransactionsTable";
import { DownloadActions } from "@/components/payee-history/DownloadActions";
const PayeeHistory = () => {
  const {payeeId} = useParams<{payeeId: string;}>();
  const navigate = useNavigate();
  const [payee, setPayee] = useState<Payee | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [appliedFilters, setAppliedFilters] = useState({
    status: "all" as TransactionStatus | "all",
    method: "all" as PaymentMethod | "all",
    dateRange: undefined as DateRange | undefined
  });
  
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

  // Load payee and transaction data
  useEffect(() => {
    if (!payeeId) return;
    const payeeData = mockPayees.find(p => p.id === payeeId);
    if (payeeData) {
      setPayee(payeeData);
      const payeeTransactions = getPayeeTransactions(payeeId);
      setTransactions(payeeTransactions);
      
      // Initialize edit data based on payee type
      if (payeeData.type === 'bank') {
        const bankPayee = payeeData as BankPayee;
        setEditData({
          email: bankPayee.email,
          contactNumber: bankPayee.contactNumber,
          accountNumber: bankPayee.accountNumber,
          ifscCode: bankPayee.ifscCode || "",
          bankName: bankPayee.bankName
        });
      } else if (payeeData.type === 'payroll') {
        const payrollPayee = payeeData as PayrollPayee;
        setEditData({
          email: payrollPayee.email,
          contactNumber: payrollPayee.contactNumber,
          accountNumber: payrollPayee.accountNumber,
          ifscCode: payrollPayee.ifscCode || "",
          bankName: payrollPayee.bankName
        });
      } else if (payeeData.type === 'biller') {
        const billerPayee = payeeData as BillerPayee;
        setEditData({
          email: billerPayee.email,
          contactNumber: billerPayee.contactNumber,
          accountNumber: "",
          ifscCode: "",
          bankName: ""
        });
      }
    }
  }, [payeeId]);

  // Calculate totals
  const totalPaid = getPayeeTotalPayments(payeeId || "");
  const lastTransactionDate = getPayeeLastTransactionDate(payeeId || "");

  // Handle filter application
  const handleApplyFilters = (filters: {
    status: TransactionStatus | "all";
    method: PaymentMethod | "all";
    dateRange: DateRange | undefined;
  }) => {
    setAppliedFilters(filters);
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setAppliedFilters({
      status: "all",
      method: "all",
      dateRange: undefined
    });
  };
  
  // IFSC validation function
  const validateIfsc = async (ifsc: string) => {
    if (ifsc.length !== 11) {
      setIfscValid(false);
      return;
    }
    
    setIsValidatingIfsc(true);
    // Simulate IFSC validation API call
    setTimeout(() => {
      const mockBankNames: { [key: string]: string } = {
        'SBIN0000001': 'State Bank of India - Main Branch',
        'HDFC0000001': 'HDFC Bank - Corporate Branch',
        'ICIC0000001': 'ICICI Bank - Business Branch',
        'AXIS0000001': 'Axis Bank - Commercial Branch'
      };
      
      if (mockBankNames[ifsc]) {
        setEditData(prev => ({ ...prev, bankName: mockBankNames[ifsc] }));
        setIfscValid(true);
      } else {
        setIfscValid(false);
      }
      setIsValidatingIfsc(false);
    }, 1000);
  };
  
  // Handle IFSC change
  const handleIfscChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setEditData(prev => ({ ...prev, ifscCode: upperValue }));
    
    if (upperValue.length === 11) {
      validateIfsc(upperValue);
    } else {
      setIfscValid(null);
      setEditData(prev => ({ ...prev, bankName: "" }));
    }
  };
  
  // Handle save
  const handleSave = (section: 'company' | 'bank') => {
    // Here you would typically make an API call to save the data
    console.log(`Saving ${section} data:`, editData);
    
    if (section === 'company') {
      setIsEditingCompany(false);
    } else {
      setIsEditingBank(false);
    }
    
    // Update the payee data in state (in a real app, this would be handled by the API)
    // For now, we'll just close the edit mode
  };
  
  // Handle cancel
  const handleCancel = (section: 'company' | 'bank') => {
    if (section === 'company') {
      setIsEditingCompany(false);
    } else {
      setIsEditingBank(false);
    }
    
    // Reset edit data to original values
    if (payee) {
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
    if (!payee) return [];
    
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
    if (!payee || payee.type === 'biller') return [];
    
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

  if (!payee) {
    return <div className="p-8 text-center">
        <h2 className="text-xl font-semibold">Payee not found</h2>
        <p className="text-muted-foreground mt-2">The payee you are looking for does not exist.</p>
        <Button className="mt-4" onClick={() => navigate("/payees")}>
          Back to Payees
        </Button>
      </div>;
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
            <h1 className="text-2xl font-semibold text-foreground">{payee.name}</h1>
            <p className="text-muted-foreground text-sm mt-1 capitalize">{payee.type} Payee</p>
          </div>
          <DownloadActions payeeName={payee.name} />
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
        </TabsContent>
        
        <TabsContent value="history" className="mt-6 space-y-6">
          {/* Filters Section */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              Filters
            </h3>
            <FilterCard onApplyFilters={handleApplyFilters} />
          </div>
          
          {/* Transactions Table */}
          <TransactionsTable transactions={transactions} appliedFilters={appliedFilters} onResetFilters={handleResetFilters} />
        </TabsContent>
      </Tabs>
    </div>;
};
export default PayeeHistory;