import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { mockInvoices, Invoice } from "@/data/mockInvoices";
import InvoiceList from "@/components/invoices/InvoiceList";
import InvoiceDetails from "@/components/invoices/InvoiceDetails";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Invoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = mockInvoices.filter(invoice =>
    invoice.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.invoiceNumber.includes(searchQuery)
  );

  const totalInvoices = mockInvoices.length;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Invoices</h1>
          <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
            Manage and track all your invoices
          </p>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={selectedInvoice ? 40 : 100} minSize={30}>
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">All Bills</span>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Filter options</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {totalInvoices}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Invoice List */}
            <div className="flex-1 overflow-auto p-4">
              <InvoiceList
                invoices={filteredInvoices}
                selectedInvoice={selectedInvoice}
                onInvoiceSelect={setSelectedInvoice}
              />
            </div>
          </div>
        </ResizablePanel>

        {selectedInvoice && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={30}>
              <div className="h-full animate-slide-in-right">
                <InvoiceDetails invoice={selectedInvoice} />
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Invoices;