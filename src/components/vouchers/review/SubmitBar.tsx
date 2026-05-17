import { Button } from "@/components/ui/button";
import { CheckCircle2, Send } from "lucide-react";

interface SubmitBarProps {
  isSubmitting: boolean;
  isAlreadyValidated: boolean;
  onSubmit: () => void;
}

const SubmitBar = ({ isSubmitting, isAlreadyValidated, onSubmit }: SubmitBarProps) => {
  if (isAlreadyValidated) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-4">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <p className="text-sm font-medium text-green-700">
          This document has already been validated and cannot be re-submitted.
        </p>
      </div>
    );
  }
  return (
    <Button
      onClick={onSubmit}
      disabled={isSubmitting}
      className="w-full h-12 text-base font-medium"
      size="lg"
    >
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Validating…
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Validate &amp; Submit
        </span>
      )}
    </Button>
  );
};

export default SubmitBar;
