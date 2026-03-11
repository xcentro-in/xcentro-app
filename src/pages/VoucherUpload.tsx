import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Upload, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { toast } from "sonner";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

import UploadDragger from "@/components/vouchers/UploadDragger";
import ProcessingStatus from "@/components/vouchers/ProcessingStatus";
import ExtractionReviewForm, {
  type ExtractedData,
} from "@/components/vouchers/ExtractionReviewForm";

/* ------------------------------------------------------------------ */
/*  Stage machine                                                     */
/* ------------------------------------------------------------------ */

type Stage = "UPLOAD" | "PROCESSING" | "REVIEW" | "SUCCESS";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

const VoucherUpload = () => {
  const navigate = useNavigate();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();

  const [stage, setStage] = useState<Stage>("UPLOAD");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [documentId, setDocumentId] = useState("");

  // Set page title
  useState(() => {
    setTitle("Upload Voucher Document");
  });

  /* ---- Fetch draft data once we hit REVIEW ---- */

  const {
    data: draftResponse,
    isLoading: isDraftLoading,
    error: draftError,
  } = useQuery({
    queryKey: ["voucher-draft", documentId],
    queryFn: async () => {
      if (!businessId) throw new Error("Business context missing");
      return voucherAPI.getDraftData(businessId, documentId);
    },
    enabled: stage === "REVIEW" && !!documentId && !!businessId,
    staleTime: Infinity, // Don't refetch — user will be editing this data
  });

  /* ---- Upload handler ---- */

  const handleUpload = async (file: File, docType: string) => {
    if (!businessId) {
      toast.error("Business context not available");
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      const resp = (await voucherAPI.uploadDocument(businessId, file, docType)) as {
        data?: { document_id?: string };
      };
      setDocumentId(resp.data?.document_id ?? "");
      toast.success("Document uploaded successfully");
      setStage("PROCESSING");
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error("Upload failed", {
        description: err?.message ?? "Please try again",
      });
    } finally {
      setIsUploading(false);
    }
  };

  /* ---- Processing complete → move to review ---- */

  const handleProcessingComplete = useCallback(() => {
    setStage("REVIEW");
  }, []);

  /* ---- Processing failed → back to upload ---- */

  const handleProcessingFailed = useCallback(() => {
    toast.error("Document extraction failed. Please try again.");
    setDocumentId("");
    setStage("UPLOAD");
  }, []);

  /* ---- Submit validated data ---- */

  const handleReviewSubmit = async (corrected: ExtractedData) => {
    if (!businessId) {
      toast.error("Business context not available");
      return;
    }

    setIsSubmitting(true);
    try {
      await voucherAPI.validateDocument(businessId, documentId, corrected);
      toast.success("Document validated and saved!");
      setStage("SUCCESS");
    } catch (err: any) {
      console.error("Validation submit failed:", err);
      toast.error("Failed to save", {
        description: err?.message ?? "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---- Reset flow ---- */

  const resetFlow = useCallback(() => {
    setDocumentId("");
    setUploadedFileName("");
    setStage("UPLOAD");
  }, []);

  /* ---- Extract draft data into the shape ExtractionReviewForm expects ---- */

  const extractedData: ExtractedData | null = (() => {
    if (!draftResponse) return null;
    const resp = draftResponse as any;
    
    // The backend sometimes wraps in { data: ... } or returns directly
    const draftPayload = resp?.draft_data || resp?.data?.draft_data;
    
    // Also, if the entire response IS the draft data (e.g. it has `invoice_number` directly)
    const draft = draftPayload || (resp?.invoice_number ? resp : null);
    
    if (!draft) return null;

    return {
      vendor_name: draft.vendor_name ?? "",
      invoice_number: draft.invoice_number ?? "",
      invoice_date: draft.invoice_date ?? "",
      due_date: draft.due_date ?? "",
      currency: draft.currency ?? "INR",
      subtotal: draft.subtotal ?? 0,
      tax_amount: draft.tax_amount ?? 0,
      discount: draft.discount ?? 0,
      discount_type: draft.discount_type ?? 'FLAT',
      total_amount: draft.total_amount ?? 0,
      notes: draft.notes ?? "",
      line_items: (draft.line_items ?? []).map((li: any) => ({
        description: li.description ?? "",
        quantity: li.quantity ?? 0,
        rate: li.rate ?? li.unit_price ?? 0,
        amount: li.amount ?? li.total ?? 0,
      })),
    } satisfies ExtractedData;
  })();

  /* ---- Render ---- */

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 border-b">
        <Button
          variant="ghost"
          className="w-fit pl-0 hover:pl-0 hover:bg-transparent -ml-2 text-muted-foreground"
          size="icon"
          onClick={() => navigate("/bills")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Bills
        </Button>

        {/* Stage indicator pills */}
        <div className="hidden sm:flex items-center gap-1 text-xs">
          {(["UPLOAD", "PROCESSING", "REVIEW", "SUCCESS"] as Stage[]).map(
            (s, i) => {
              const labels = ["Upload", "Processing", "Review", "Done"];
              const isActive = s === stage;
              const isDone =
                ["UPLOAD", "PROCESSING", "REVIEW", "SUCCESS"].indexOf(stage) > i;

              return (
                <div key={s} className="flex items-center gap-1">
                  {i > 0 && (
                    <div
                      className={`w-6 h-px ${
                        isDone ? "bg-green-400" : "bg-border"
                      }`}
                    />
                  )}
                  <span
                    className={`
                      px-2.5 py-1 rounded-full transition-colors
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : isDone
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }
                    `}
                  >
                    {labels[i]}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <div className="max-w-3xl mx-auto p-6">
          {/* Page heading */}
          {stage !== "SUCCESS" && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {stage === "UPLOAD" && (
                  <>
                    <Upload className="h-6 w-6 text-primary" />
                    Upload Voucher Document
                  </>
                )}
                {stage === "PROCESSING" && (
                  <>
                    <FileText className="h-6 w-6 text-primary" />
                    Extracting Data…
                  </>
                )}
                {stage === "REVIEW" && (
                  <>
                    <FileText className="h-6 w-6 text-primary" />
                    Review & Validate
                  </>
                )}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {stage === "UPLOAD" &&
                  "Upload an invoice or purchase order PDF/image to automatically extract its data."}
                {stage === "PROCESSING" &&
                  "Please wait while we extract data from your document."}
                {stage === "REVIEW" &&
                  "Verify the extracted fields and make corrections if needed before submitting."}
              </p>
            </div>
          )}

          {/* Stage views */}
          {stage === "UPLOAD" && (
            <UploadDragger onUpload={handleUpload} isUploading={isUploading} />
          )}

          {stage === "PROCESSING" && (
            <ProcessingStatus
              fileName={uploadedFileName}
              documentId={documentId}
              onComplete={handleProcessingComplete}
              onFailed={handleProcessingFailed}
            />
          )}

          {stage === "REVIEW" && (
            <>
              {isDraftLoading && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading extracted data…</p>
                </div>
              )}

              {draftError && (
                <div className="text-center py-16 space-y-4">
                  <p className="text-destructive">Failed to load extracted data.</p>
                  <Button variant="outline" onClick={resetFlow}>
                    Start Over
                  </Button>
                </div>
              )}

              {extractedData && !isDraftLoading && !draftError && (
                <ExtractionReviewForm
                  data={extractedData}
                  onSubmit={handleReviewSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}

          {stage === "SUCCESS" && (
            <div className="text-center py-16 space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">
                  Document Validated Successfully
                </h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  The extracted data has been reviewed, corrected if needed, and
                  saved with status <strong>VALIDATED</strong>.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" onClick={resetFlow}>
                  Upload Another
                </Button>
                <Button onClick={() => navigate("/bills")}>
                  Go to Bills
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherUpload;
