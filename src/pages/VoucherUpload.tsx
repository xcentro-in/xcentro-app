import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle2, Upload, FileText, Loader2, Copy } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePageTitle } from "@/contexts/PageTitleContext";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import { useBusiness } from "@/contexts/BusinessContext";
import { toast } from "sonner";
import { voucherAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

import UploadDragger from "@/components/vouchers/UploadDragger";
import ProcessingStatus from "@/components/vouchers/ProcessingStatus";
import ExtractionReviewContainer from "@/components/vouchers/ExtractionReviewContainer";
import { type ExtractedData, type PayeeResolution, type BusinessResolution } from "@/components/vouchers/InvoiceReviewForm";
import type { VoucherDraftResponse } from "@/types/voucher-document";
import { transformDraftToExtractedData } from "@/services/transformers/voucherDraft";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif']);

function isImageUrl(url: string): boolean {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.has(ext);
}

/* ------------------------------------------------------------------ */
/*  Stage machine                                                     */
/* ------------------------------------------------------------------ */

type Stage = "UPLOAD" | "PROCESSING" | "DUPLICATE" | "REVIEW" | "SUCCESS";

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

const VoucherUpload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTitle } = usePageTitle();
  const { businessId } = useCurrentBusiness();
  const { selectedBusiness } = useBusiness();

  // If we arrive with a documentId query param, jump straight to REVIEW
  const initialDocumentId = searchParams.get("documentId") ?? "";
  const initialStage: Stage = initialDocumentId ? "REVIEW" : "UPLOAD";

  const [stage, setStage] = useState<Stage>(initialStage);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [documentId, setDocumentId] = useState(initialDocumentId);

  // Set page title
  useState(() => {
    setTitle("Upload Voucher Document");
  });

  /* ---- Fetch draft data once we hit REVIEW ---- */

  const {
    data: draftResponse,
    isLoading: isDraftLoading,
    error: draftError,
  } = useQuery<VoucherDraftResponse>({
    queryKey: ["voucher-draft", documentId],
    queryFn: async () => {
      if (!businessId) throw new Error("Business context missing");
      return voucherAPI.getDraftData(documentId) as Promise<VoucherDraftResponse>;
    },
    enabled: stage === "REVIEW" && !!documentId && !!businessId,
    staleTime: Infinity, // Don't refetch — user will be editing this data
  });

  const { data: docUrlResponse, isLoading: isDocUrlLoading } = useQuery({
    queryKey: ["voucher-doc-url", documentId],
    queryFn: () => voucherAPI.getDocumentUrl(documentId),
    enabled: (stage === "REVIEW" || stage === "DUPLICATE") && !!documentId && !!businessId,
    staleTime: 4 * 60 * 1000, // re-fetch before presigned URL expires
  });
  const documentUrl: string | null = docUrlResponse?.data?.url ?? null;

  /* ---- Upload handler ---- */

  const handleUpload = async (file: File) => {
    if (!businessId) {
      toast.error("Business context not available");
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      const resp = await voucherAPI.uploadDocument(file);
      const newDocId = resp.data?.document_id;
      if (!newDocId) {
        // Response lacked the document_id — don't advance to PROCESSING or
        // we'll poll against nothing.
        throw new Error("Upload succeeded but server did not return a document_id");
      }
      setDocumentId(newDocId);
      if (resp.data?.is_duplicate) {
        setStage("DUPLICATE");
      } else {
        toast.success("Document uploaded successfully");
        setStage("PROCESSING");
      }
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
      await voucherAPI.validateDocument(documentId, corrected);
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

  /* ---- Derive document status from draft response ---- */
  const documentStatus = draftResponse?.data?.document_status ?? "";
  const isAlreadyValidated = documentStatus === 'VALIDATED';

  const extractedData: ExtractedData | null = transformDraftToExtractedData(draftResponse, {
    buyerGstinFallback: selectedBusiness?.gstin,
  });

  /* ---- Parse resolution data from draft response ---- */

  const payeeResolution: PayeeResolution | null = (() => {
    if (!draftResponse) return null;
    const resp = draftResponse as any;
    const resolution = resp?.data?.payee_resolution || resp?.payee_resolution;
    if (!resolution) return null;
    return {
      payee_id: resolution.payee_id ?? null,
      status: resolution.status ?? 'NOT_FOUND',
      confidence: resolution.confidence ?? 'LOW',
      suggested_data: resolution.suggested_data,
    };
  })();

  const businessResolution: BusinessResolution | null = (() => {
    if (!draftResponse) return null;
    const resp = draftResponse as any;
    const resolution = resp?.data?.business_resolution || resp?.business_resolution;
    if (!resolution) return null;
    return {
      business_id: resolution.business_id ?? null,
      resolved_via: resolution.resolved_via ?? 'unknown',
    };
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
          onClick={() => navigate("/vouchers")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Vouchers
        </Button>

        {/* Stage indicator pills */}
        <div className="hidden sm:flex items-center gap-1 text-xs">
          {(stage === "DUPLICATE"
            ? (["UPLOAD", "DUPLICATE"] as Stage[])
            : (["UPLOAD", "PROCESSING", "REVIEW", "SUCCESS"] as Stage[])
          ).map(
            (s, i) => {
              const labels = stage === "DUPLICATE"
                ? ["Upload", "Duplicate"]
                : ["Upload", "Processing", "Review", "Done"];
              const isActive = s === stage;
              const stageOrder = stage === "DUPLICATE"
                ? ["UPLOAD", "DUPLICATE"]
                : ["UPLOAD", "PROCESSING", "REVIEW", "SUCCESS"];
              const isDone = stageOrder.indexOf(stage) > i;

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

      {/* Main content — overflow-auto for non-REVIEW; REVIEW gets explicit height so each column scrolls independently */}
      <div className={stage === "REVIEW" ? "flex-1" : "flex-1 overflow-auto bg-muted/30"}>

        {/* UPLOAD / PROCESSING / DUPLICATE / SUCCESS — narrow centered layout */}
        {stage !== "REVIEW" && (
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
                  {stage === "DUPLICATE" && (
                    <>
                      <Copy className="h-6 w-6 text-amber-500" />
                      Duplicate Document Detected
                    </>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {stage === "UPLOAD" &&
                    "Upload an invoice or purchase order PDF/image to automatically extract its data."}
                  {stage === "PROCESSING" &&
                    "Please wait while we extract data from your document."}
                  {stage === "DUPLICATE" &&
                    "This file has already been uploaded. The document stored on record is shown below."}
                </p>
              </div>
            )}

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

            {stage === "DUPLICATE" && (
              <div className="space-y-4">
                <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                  <Copy className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Already uploaded</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    A document with identical content was previously uploaded and is shown below.
                    The file you just submitted has <strong>not</strong> been stored again.
                  </AlertDescription>
                </Alert>

                {/* Existing document preview */}
                <div className="rounded-lg border overflow-hidden bg-white" style={{ height: "60vh" }}>
                  {isDocUrlLoading && (
                    <div className="flex flex-col gap-3 p-4 h-full">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="flex-1 w-full" />
                    </div>
                  )}
                  {!isDocUrlLoading && documentUrl && (
                    isImageUrl(documentUrl)
                      ? <div className="w-full h-full overflow-auto"><img src={documentUrl} className="w-full h-auto block" alt="Existing Document" /></div>
                      : <iframe src={documentUrl} className="w-full h-full border-0 block" title="Existing Document" />
                  )}
                  {!isDocUrlLoading && !documentUrl && (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8">
                      <div className="text-center space-y-2">
                        <FileText className="h-10 w-10 mx-auto opacity-40" />
                        <p>Preview unavailable for the existing document.</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={() => setStage("REVIEW")}>
                    Review Existing Document
                  </Button>
                  <Button variant="outline" onClick={resetFlow}>
                    Upload a Different Document
                  </Button>
                </div>
              </div>
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
                  <Button onClick={() => navigate("/vouchers")}>
                    Go to Vouchers
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REVIEW — explicit height flex row so each column scrolls independently.
            61px = top-bar height (p-3 × 2 + h-9 button + 1px border).
            The PDF fills its column height; the iframe's own scroll handles page navigation.
            The form column overflows independently on the right. */}
        {stage === "REVIEW" && (
          <div className="flex" style={{ height: "calc(100vh - 61px)" }}>

            {/* Left: document preview — fixed height, no overflow. iframe handles PDF scroll; image container scrolls for tall images. */}
            <div className="hidden lg:flex flex-col w-1/2 flex-shrink-0 h-full border-r">
              {isDocUrlLoading && (
                <div className="flex flex-col gap-3 p-4 h-full">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="flex-1 w-full" />
                </div>
              )}
              {!isDocUrlLoading && documentUrl && (
                isImageUrl(documentUrl)
                  ? <div className="w-full h-full overflow-auto"><img src={documentUrl} className="w-full h-auto block" alt="Original Document" /></div>
                  : <iframe src={documentUrl} className="w-full flex-1 border-0 block" title="Original Document" />
              )}
              {!isDocUrlLoading && !documentUrl && (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8">
                  <div className="text-center space-y-2">
                    <FileText className="h-10 w-10 mx-auto opacity-40" />
                    <p>Document preview unavailable.</p>
                    <p className="text-xs">You can still review and submit the extracted data on the right.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Review form — scrolls independently within the same fixed height */}
            <div className="w-full lg:w-1/2 h-full overflow-auto p-6">
              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Review & Validate
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Verify the extracted fields and make corrections if needed before submitting.
                </p>
              </div>

              {/* Mobile-only: compact document viewer above the form */}
              <div className="lg:hidden mb-6 rounded-lg border overflow-hidden" style={{ height: "50vh" }}>
                {documentUrl
                  ? (isImageUrl(documentUrl)
                      ? <div className="w-full h-full overflow-auto"><img src={documentUrl} className="w-full h-auto block" alt="Original Document" /></div>
                      : <iframe src={documentUrl} className="w-full h-full border-0 block" title="Original Document" />)
                  : <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Preview unavailable</div>
                }
              </div>

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
                <ExtractionReviewContainer
                  data={extractedData}
                  onSubmit={handleReviewSubmit}
                  isSubmitting={isSubmitting}
                  payeeResolution={payeeResolution}
                  businessResolution={businessResolution}
                  businessId={businessId}
                  isAlreadyValidated={isAlreadyValidated}
                />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VoucherUpload;
