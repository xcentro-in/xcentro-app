
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

interface ApprovalBatchActionsProps {
  selectedCount: number;
  onBatchApprove: () => void;
}

const ApprovalBatchActions = ({ 
  selectedCount, 
  onBatchApprove 
}: ApprovalBatchActionsProps) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bg-muted/60 p-2 border-b flex items-center justify-between">
      <div className="text-sm">
        <span className="font-medium">{selectedCount}</span> transactions selected
      </div>
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-8 gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={onBatchApprove}
        >
          <CheckCheck className="h-4 w-4" />
          Batch Approve
        </Button>
      </div>
    </div>
  );
};

export default ApprovalBatchActions;
