import { useState, useEffect } from "react";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VoucherDocumentsTable from "@/components/vouchers/VoucherDocumentsTable";
import PurchaseOrdersTable from "@/components/vouchers/PurchaseOrdersTable";
import InvoicesTable from "@/components/vouchers/InvoicesTable";
import MatchResultsTable from "@/components/vouchers/MatchResultsTable";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Vouchers = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    setTitle("Vouchers & Documents");
  }, [setTitle]);

  // Fetch Documents
  const { data: docsResponse, isLoading: isDocsLoading } = useQuery({
    queryKey: ["voucher-documents", businessId],
    queryFn: () => businessId ? voucherAPI.listDocuments(businessId) : null,
    enabled: !!businessId && activeTab === "documents",
  });

  // Bills data management for Invoices tab
  const [billsFilters, setBillsFilters] = useState({
    status: 'all' as 'all' | 'paid' | 'open' | 'overdue',
    page: 1,
    limit: 20,
    sortBy: 'dueDate' as 'dueDate' | 'billDate' | 'amount' | 'vendor' | 'status',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Fetch Invoices
  const { data: invoicesResponse, isLoading: isInvoicesLoading } = useQuery({
    queryKey: ["voucher-invoices", businessId, billsFilters.page],
    queryFn: () => businessId ? voucherAPI.listInvoices(businessId, billsFilters.page, billsFilters.limit) : null,
    enabled: !!businessId && activeTab === "invoices",
  });

  // Fetch Purchase Orders
  const { data: posResponse, isLoading: isPosLoading } = useQuery({
    queryKey: ["voucher-pos", businessId],
    queryFn: () => businessId ? voucherAPI.listPurchaseOrders(businessId) : null,
    enabled: !!businessId && activeTab === "pos",
  });

  // Fetch Match Results
  const { data: matchResultsResponse, isLoading: isMatchResultsLoading } = useQuery({
    queryKey: ["voucher-match-results", businessId],
    queryFn: () => businessId ? (voucherAPI as any).listMatchResults(businessId) : null,
    enabled: !!businessId && activeTab === "match-results",
  });

  const documents = (docsResponse as any)?.data?.items ?? [];
  const pos = (posResponse as any)?.data?.items ?? [];
  const invoices = (invoicesResponse as any)?.data?.items ?? [];
  const matchResults = (matchResultsResponse as any)?.data?.items ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vouchers</h2>
        <Button onClick={() => navigate("/vouchers/upload")} className="h-9">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <Tabs defaultValue="documents" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">Voucher Documents</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="pos">Purchase Orders</TabsTrigger>
          <TabsTrigger value="match-results">Match Results</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <VoucherDocumentsTable documents={documents} isLoading={isDocsLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoicesTable
                invoices={invoices}
                isLoading={isInvoicesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseOrdersTable pos={pos} isLoading={isPosLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="match-results" className="space-y-4">
          <Card className="animate-scale-in">
            <CardHeader>
              <CardTitle>Match Results</CardTitle>
            </CardHeader>
            <CardContent>
              <MatchResultsTable matchResults={matchResults} isLoading={isMatchResultsLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vouchers;
