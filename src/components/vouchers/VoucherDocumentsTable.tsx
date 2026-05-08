import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertCircle, FileText, ExternalLink, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { voucherAPI } from "@/services/api";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";
import type {
  VoucherDocumentStatus,
  VoucherDocumentListItem,
} from "@/types/voucher-document";

const TERMINAL_STATUSES = new Set<VoucherDocumentStatus>([
  "REVIEW_REQUIRED",
  "VALIDATED",
  "FAILED",
]);
const PROCESSING_STATUSES = new Set<VoucherDocumentStatus>([
  "QUEUED",
  "OCR_PROCESSING",
  "PENDING_LLM",
  "LLM_PROCESSING",
]);

// Polling cadence for in-flight documents. We back off exponentially so a
// long extraction (or a downed API) doesn't hammer the server, and we cap
// total time so a zombie document doesn't spin forever.
const POLL_INITIAL_MS = 3_000;
const POLL_MAX_MS = 30_000;
const POLL_BACKOFF_FACTOR = 1.5;
const POLL_MAX_DURATION_MS = 10 * 60_000; // 10 min ceiling per retry batch

interface VoucherDocumentsTableProps {
  documents: VoucherDocumentListItem[];
  isLoading?: boolean;
  onRefetch?: () => void;
}

const VoucherDocumentsTable = ({ documents, isLoading = false, onRefetch }: VoucherDocumentsTableProps) => {
  const navigate = useNavigate();
  const { businessId } = useCurrentBusiness();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [retryingDocIds, setRetryingDocIds] = useState<Set<string>>(new Set());
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  // Guard against setState after unmount. setInterval callbacks can otherwise
  // schedule an update after React has torn the component down.
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const inProgress = documents
      .filter((d) => PROCESSING_STATUSES.has(d.status))
      .map((d) => d.id);
    if (inProgress.length === 0) return;
    setRetryingDocIds((prev) => {
      const next = new Set(prev);
      inProgress.forEach((id) => next.add(id));
      return next;
    });
  }, [documents]);

  useEffect(() => {
    if (retryingDocIds.size === 0 || !businessId) return;

    let cancelled = false;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let delay = POLL_INITIAL_MS;
    const startedAt = Date.now();
    let consecutiveErrors = 0;

    const tick = async () => {
      if (cancelled) return;
      if (Date.now() - startedAt > POLL_MAX_DURATION_MS) {
        // Give up — the documents list will refresh on next user action.
        return;
      }

      const completed = new Set<string>();
      let sawError = false;

      await Promise.all(
        [...retryingDocIds].map(async (docId) => {
          try {
            const resp = await voucherAPI.checkStatus(businessId, docId);
            const status = resp?.data?.document_status;
            if (status && TERMINAL_STATUSES.has(status)) {
              completed.add(docId);
            }
          } catch {
            sawError = true;
            // Don't drop the doc on a single transient error; the backoff
            // below will slow us down instead.
          }
        })
      );

      if (cancelled || !isMounted.current) return;

      if (completed.size > 0) {
        setRetryingDocIds((prev) => {
          const next = new Set(prev);
          completed.forEach((id) => next.delete(id));
          return next;
        });
      }

      onRefetch?.();

      if (sawError) {
        consecutiveErrors += 1;
        if (consecutiveErrors >= 5) return; // stop after sustained failure
        delay = Math.min(delay * POLL_BACKOFF_FACTOR, POLL_MAX_MS);
      } else {
        consecutiveErrors = 0;
        // Keep a steady cadence while work is progressing, but still cap.
        delay = Math.min(delay * 1.1, POLL_MAX_MS);
      }

      timerId = setTimeout(tick, delay);
    };

    timerId = setTimeout(tick, delay);
    return () => {
      cancelled = true;
      if (timerId !== null) clearTimeout(timerId);
    };
  }, [retryingDocIds, businessId, onRefetch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "QUEUED":
      case "OCR_PROCESSING":
      case "PENDING_LLM":
      case "LLM_PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "REVIEW_REQUIRED":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "VALIDATED":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "QUEUED":
      case "OCR_PROCESSING":
      case "PENDING_LLM":
      case "LLM_PROCESSING":
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case "REVIEW_REQUIRED":
        return <AlertCircle className="h-3 w-3" />;
      case "VALIDATED":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const handleViewPdf = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (!businessId) return;
    setLoadingDocId(docId);
    try {
      const resp = await voucherAPI.getDocumentUrl(businessId, docId);
      const url = resp?.data?.url;
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      if (isMounted.current) setLoadingDocId(null);
    }
  };

  const handleRetry = async (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (!businessId) return;
    setActionLoadingId(docId);
    try {
      await voucherAPI.retryDocument(businessId, docId);
      setRetryingDocIds((prev) => new Set([...prev, docId]));
      onRefetch?.();
    } finally {
      if (isMounted.current) setActionLoadingId(null);
    }
  };

  const confirmDelete = useCallback(async () => {
    if (!deleteDialogId || !businessId) return;
    const docId = deleteDialogId;
    setActionLoadingId(docId);
    try {
      await voucherAPI.deleteDocument(businessId, docId);
      onRefetch?.();
    } finally {
      if (isMounted.current) {
        setActionLoadingId(null);
        setDeleteDialogId(null);
      }
    }
  }, [deleteDialogId, businessId, onRefetch]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>File Name</TableHead>
            <TableHead>Uploaded At</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <TableRow
                key={doc.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/vouchers/upload?documentId=${doc.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {doc.file_name || doc.s3_path?.split("/").pop() || "Unnamed Document"}
                  </div>
                </TableCell>
                <TableCell>{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "-"}</TableCell>
                <TableCell>
                  {doc.doc_type ? (
                    <Badge variant="outline" className="capitalize">
                      {doc.doc_type.toLowerCase().replace("_", " ")}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize text-xs", getStatusColor(doc.status || ""))}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(doc.status || "")}
                      {(doc.status || "").toLowerCase().replace("_", " ")}
                    </span>
                  </Badge>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleViewPdf(e, doc.id)}
                    disabled={loadingDocId === doc.id}
                  >
                    {loadingDocId === doc.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <ExternalLink className="h-4 w-4" />
                    }
                  </Button>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {doc.status === "FAILED" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleRetry(e, doc.id)}
                        disabled={actionLoadingId === doc.id}
                        title="Retry extraction"
                      >
                        {actionLoadingId === doc.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <RotateCcw className="h-4 w-4" />
                        }
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogId(doc.id);
                      }}
                      disabled={actionLoadingId === doc.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-muted-foreground">
                  {isLoading ? "Loading documents..." : "No documents found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogId !== null} onOpenChange={(open) => !open && setDeleteDialogId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              The PDF and its extraction data will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoadingId !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={actionLoadingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoadingId === deleteDialogId
                ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VoucherDocumentsTable;
