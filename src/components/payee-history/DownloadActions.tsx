
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleDownload("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            <span>PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDownload("csv")}>
            <FileText className="h-4 w-4 mr-2" />
            <span>CSV</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" />
      </Button>
    </div>
  );
};
