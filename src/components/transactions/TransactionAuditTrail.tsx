
import { TransactionAuditLog } from "@/types/transaction";
import { format } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TransactionAuditTrailProps {
  auditTrail: TransactionAuditLog[];
}

export const TransactionAuditTrail = ({ auditTrail }: TransactionAuditTrailProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sort audit trail by timestamp (newest first)
  const sortedAuditTrail = [...auditTrail].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Get the first 3 entries for the preview
  const previewEntries = sortedAuditTrail.slice(0, 3);
  const hasMoreEntries = sortedAuditTrail.length > 3;

  return (
    <div className="space-y-2">
      {/* Always show the first 3 entries */}
      {previewEntries.map((log) => (
        <div key={log.id} className="flex gap-4 border-b pb-3 last:border-0 last:pb-0">
          <div className="min-w-[150px] text-sm text-muted-foreground">
            {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
          </div>
          <div>
            <div className="text-sm font-medium">{log.action}</div>
            <div className="text-xs text-muted-foreground">
              {log.user.name} ({log.user.role})
            </div>
            {log.details && (
              <div className="mt-1 text-xs text-muted-foreground">
                Note: {log.details}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* If there are more than 3 entries, show the collapsible section */}
      {hasMoreEntries && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="pt-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full flex justify-center gap-1 h-8">
              {isOpen ? (
                <>
                  Show Less <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show More ({sortedAuditTrail.length - 3} entries) <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2 space-y-2">
              {sortedAuditTrail.slice(3).map((log) => (
                <div key={log.id} className="flex gap-4 border-b pb-3 last:border-0 last:pb-0">
                  <div className="min-w-[150px] text-sm text-muted-foreground">
                    {format(new Date(log.timestamp), "MMM d, yyyy h:mm a")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{log.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.user.name} ({log.user.role})
                    </div>
                    {log.details && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Note: {log.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};
