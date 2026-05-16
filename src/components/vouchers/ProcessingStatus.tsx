import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, Loader2, ScanSearch, Database, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { voucherAPI } from "@/services/api";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import type { VoucherDocumentStatus } from "@/types/voucher-document";

interface ProcessingStatusProps {
  fileName: string;
  documentId: string;
  onComplete: () => void;
  onFailed?: () => void;
}

const STEPS = [
  { id: "upload", label: "File uploaded to secure storage", icon: FileText },
  { id: "queue", label: "Queued for extraction", icon: Database },
  { id: "ocr", label: "Running OCR & data extraction", icon: ScanSearch },
  { id: "done", label: "Extraction complete", icon: CheckCircle2 },
];

/**
 * Maps a backend status string to a step index (0-3).
 */
const statusToStep = (status: VoucherDocumentStatus): number => {
  switch (status) {
    case "QUEUED":
      return 1;
    case "OCR_PROCESSING":
      return 2;
    case "PENDING_LLM":
    case "LLM_PROCESSING":
      return 2;
    case "REVIEW_REQUIRED":
    case "VALIDATED":
      return 3;
    default:
      return 0;
  }
};

const TERMINAL_STATUSES: VoucherDocumentStatus[] = [
  "REVIEW_REQUIRED",
  "VALIDATED",
  "FAILED",
];

/**
 * Shows processing pipeline while the backend worker extracts data.
 *
 * Polls GET /v1/vouchers/:document_id/status every 3 seconds
 * using @tanstack/react-query. Stops when a terminal status is reached.
 */
const ProcessingStatus = ({
  fileName,
  documentId,
  onComplete,
  onFailed,
}: ProcessingStatusProps) => {
  const { businessId } = useCurrentBusiness();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  const { data, error } = useQuery({
    queryKey: ["voucher-status", documentId],
    enabled: !!businessId && !!documentId,
    queryFn: async () => {
      if (!businessId) throw new Error("Business context missing");
      return voucherAPI.checkStatus(documentId);
    },
    // Back off on transient network errors: 3s→6s→12s→24s→30s cap.
    retry: 4,
    retryDelay: (attempt) => Math.min(3000 * 2 ** attempt, 30_000),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.document_status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      // If polling has been erroring, slow it down proportionally to the
      // number of consecutive failures.
      const fails = query.state.errorUpdateCount ?? 0;
      if (fails === 0) return 3_000;
      return Math.min(3_000 * Math.pow(2, Math.min(fails, 4)), 30_000);
    },
    refetchIntervalInBackground: false,
  });

  const backendStatus = data?.data?.document_status;

  // Drive stepper from backend status
  useEffect(() => {
    if (!backendStatus) return;

    const step = statusToStep(backendStatus);
    setCurrentStep(step);

    // Proportional progress
    const pct = Math.min(((step + 1) / STEPS.length) * 100, 100);
    setProgress(pct);

    if (backendStatus === "REVIEW_REQUIRED" || backendStatus === "VALIDATED") {
      // Small delay so the user sees the final "complete" step
      const t = setTimeout(() => onComplete(), 600);
      return () => clearTimeout(t);
    }

    if (backendStatus === "FAILED") {
      onFailed?.();
    }
  }, [backendStatus, onComplete, onFailed]);

  const isFailed = backendStatus === "FAILED" || !!error;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="overflow-hidden">
        {/* Gradient header */}
        {!isFailed ? (
          <div className="h-2 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 animate-pulse" />
        ) : (
          <div className="h-2 bg-destructive" />
        )}
        <CardContent className="p-8 text-center">
          {!isFailed ? (
            <>
              {/* Animated spinner */}
              <div className="relative mx-auto mb-6 w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScanSearch className="h-8 w-8 text-primary" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-1">Processing Document</h3>
              <p className="text-sm text-muted-foreground mb-6 truncate max-w-xs mx-auto">
                {fileName}
              </p>

              {/* Progress bar */}
              <Progress value={progress} className="h-2 mb-8" />

              {/* Steps */}
              <div className="space-y-4 text-left">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === currentStep;
                  const isDone = idx < currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : isDone
                            ? "text-green-600"
                            : "text-muted-foreground/50"
                        }
                      `}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                      ) : isActive ? (
                        <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5 shrink-0" />
                      )}
                      <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ---- Error state ---- */
            <>
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Extraction Failed</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Something went wrong while processing your document. Please try uploading again.
              </p>
              <Button variant="outline" onClick={() => onFailed?.()}>
                Retry Upload
              </Button>
            </>
          )}

          {documentId && !isFailed && (
            <p className="mt-6 text-xs text-muted-foreground/60 font-mono">
              ID: {documentId}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingStatus;
