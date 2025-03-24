
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DownloadActionsProps {
  payeeName: string;
}

export const DownloadActions = ({ payeeName }: DownloadActionsProps) => {
  // Handle download
  const handleDownload = (format: "pdf" | "csv") => {
    toast.success(`Downloaded statement in ${format.toUpperCase()} format`, {
      description: `${payeeName} transaction history has been downloaded`
    });
  };
  
  // Handle print statement
  const handlePrint = () => {
    toast.success("Preparing statement for print", {
      description: "The print dialog will open in a moment"
    });
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleDownload("pdf")}
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => handleDownload("csv")}
      >
        <FileText className="h-4 w-4" />
        Export CSV
      </Button>
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );
};
