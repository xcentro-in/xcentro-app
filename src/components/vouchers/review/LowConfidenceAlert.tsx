import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface LowConfidenceAlertProps {
  fields: string[];
}

const LowConfidenceAlert = ({ fields }: LowConfidenceAlertProps) => {
  if (fields.length === 0) return null;
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardContent className="p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            {fields.length} field{fields.length > 1 ? "s" : ""} extracted with low confidence
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Fields: <span className="capitalize">{fields.join(", ")}</span> — please verify these
            before submitting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LowConfidenceAlert;
