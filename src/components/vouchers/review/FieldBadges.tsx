import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pencil, AlertTriangle } from "lucide-react";

interface EditedBadgeProps {
  field: string;
  editedFields: Set<string>;
}

export const EditedBadge = ({ field, editedFields }: EditedBadgeProps) => {
  if (!editedFields.has(field)) return null;
  return (
    <Badge
      variant="outline"
      className="text-[10px] gap-0.5 px-1.5 py-0 bg-blue-50 text-blue-600 border-blue-200"
    >
      <Pencil className="h-2.5 w-2.5" /> Edited
    </Badge>
  );
};

interface ConfidenceBadgeProps {
  field: string;
  confidenceScores?: Record<string, number>;
}

export const ConfidenceBadge = ({ field, confidenceScores }: ConfidenceBadgeProps) => {
  const score = confidenceScores?.[field];
  if (score === undefined || score >= 1.0) return null;
  const pct = Math.round(score * 100);
  const lowConfidence = score < 0.7;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`text-[10px] gap-0.5 px-1.5 py-0 cursor-help ${
              lowConfidence
                ? "bg-red-50 text-red-600 border-red-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            <AlertTriangle className="h-2.5 w-2.5" /> {pct}%
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          Extraction confidence: {pct}% — please verify this field
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
