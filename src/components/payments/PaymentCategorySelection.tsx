
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Files, FileSpreadsheet, Receipt, Users, File } from "lucide-react";

type PaymentCategory = "selection" | "single" | "batch" | "gst" | "creditcard" | "payroll" | "invoice";

interface PaymentCategorySelectionProps {
  onSelect: (category: PaymentCategory) => void;
}

const PaymentCategorySelection: React.FC<PaymentCategorySelectionProps> = ({ onSelect }) => {
  const categories = [
    {
      id: "single",
      title: "Single Payment",
      description: "Make a payment to a single vendor or payee",
      icon: <FileText className="h-10 w-10 text-primary" />,
    },
    {
      id: "invoice",
      title: "Invoice Payment",
      description: "Upload and pay vendor invoices",
      icon: <File className="h-10 w-10 text-primary" />,
      highlight: true,
    },
    {
      id: "batch",
      title: "Batch Payment",
      description: "Pay multiple vendors at once with a batch upload",
      icon: <Files className="h-10 w-10 text-primary" />,
    },
    {
      id: "gst",
      title: "GST Payment",
      description: "Upload GST challan or pay GST taxes directly",
      icon: <FileSpreadsheet className="h-10 w-10 text-primary" />,
    },
    {
      id: "creditcard",
      title: "Credit Card Bill",
      description: "Pay your credit card bills quickly",
      icon: <Receipt className="h-10 w-10 text-primary" />,
    },
    {
      id: "payroll",
      title: "Payroll",
      description: "Process employee salary payments",
      icon: <Users className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center mb-6">Select Payment Type</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`hover:border-primary hover:shadow-md transition-all cursor-pointer ${
              category.highlight ? 'border-primary/50 bg-primary/5' : ''
            }`}
            onClick={() => onSelect(category.id as PaymentCategory)}
          >
            <CardContent className="flex flex-col items-center text-center p-6 h-full">
              <div className={`p-4 rounded-full mb-4 ${
                category.highlight ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                {category.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{category.title}</h3>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentCategorySelection;
