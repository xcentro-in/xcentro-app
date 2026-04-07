import React, { useState } from "react";
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
import { Clock, CheckCircle, AlertCircle, FileText, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { voucherAPI } from "@/services/api";
import { useCurrentBusiness } from "@/hooks/useCurrentBusiness";

interface VoucherDocument {
  id: string;
  file_name?: string;
  s3_path?: string;
  status: string;
  uploaded_at: string;
  doc_type?: string | null;
}

interface VoucherDocumentsTableProps {
  documents: VoucherDocument[];
  isLoading?: boolean;
}

const VoucherDocumentsTable = ({ documents, isLoading = false }: VoucherDocumentsTableProps) => {
  const navigate = useNavigate();
  const { businessId } = useCurrentBusiness();
  const [loadingDocId, setLoadingDocId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'QUEUED':
      case 'OCR_PROCESSING':
      case 'PENDING_LLM':
      case 'LLM_PROCESSING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REVIEW_REQUIRED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'VALIDATED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'QUEUED':
      case 'OCR_PROCESSING':
      case 'PENDING_LLM':
      case 'LLM_PROCESSING':
        return <Clock className="h-3 w-3" />;
      case 'REVIEW_REQUIRED':
        return <AlertCircle className="h-3 w-3" />;
      case 'VALIDATED':
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
      const resp = await (voucherAPI as any).getDocumentUrl(businessId, docId) as any;
      window.open(resp?.data?.url, '_blank');
    } finally {
      setLoadingDocId(null);
    }
  };

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
                    {doc.file_name || doc.s3_path?.split('/').pop() || 'Unnamed Document'}
                  </div>
                </TableCell>
                <TableCell>{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleString() : "-"}</TableCell>
                <TableCell>
                  {doc.doc_type ? (
                    <Badge variant="outline" className="capitalize">
                      {doc.doc_type.toLowerCase().replace('_', ' ')}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("capitalize text-xs", getStatusColor(doc.status || ''))}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(doc.status || '')}
                      {(doc.status || '').toLowerCase().replace('_', ' ')}
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
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <div className="text-muted-foreground">
                  {isLoading ? "Loading documents..." : "No documents found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default VoucherDocumentsTable;
