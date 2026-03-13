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

const Vouchers = () => {
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

  const documents = (docsResponse as any)?.data?.items ?? [];
  const pos = (posResponse as any)?.data?.items ?? [];
  const invoices = (invoicesResponse as any)?.data?.items ?? [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vouchers</h2>
      </div>

      <Tabs defaultValue="documents" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="documents">Voucher Documents</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="pos">Purchase Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <VoucherDocumentsTable documents={documents} isLoading={isDocsLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {/* BillsTable requires a lot of props, we'll simplify or pass dummy handlers where needed for now */}
              <InvoicesTable 
                invoices={invoices} 
                isLoading={isInvoicesLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <PurchaseOrdersTable pos={pos} isLoading={isPosLoading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Vouchers;
