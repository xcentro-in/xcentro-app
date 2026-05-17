import { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, ImageIcon, X, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

interface UploadDraggerProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const UploadDragger = ({ onUpload, isUploading }: UploadDraggerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Unsupported file type. Please upload a PDF, JPEG, PNG, or WebP file.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 10 MB.";
    }
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: string) => {
    if (type === "application/pdf") return <FileText className="h-8 w-8 text-red-500" />;
    return <ImageIcon className="h-8 w-8 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <Label className="text-base font-medium">Upload File</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a PDF or image of your invoice / purchase order
          </p>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => inputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed
              transition-all duration-200 ease-in-out
              flex flex-col items-center justify-center py-12 px-6 text-center
              ${
                dragActive
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
              }
              ${file ? "border-green-500/50 bg-green-50/50" : ""}
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleChange}
              className="hidden"
            />

            {!file ? (
              <>
                <div className="rounded-full bg-primary/10 p-4 mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-base font-medium mb-1">
                  Drag & drop your file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse · PDF, JPEG, PNG, WebP · Max 10 MB
                </p>
              </>
            ) : (
              <div
                className="flex items-center gap-4 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                {getFileIcon(file.type)}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit button */}
      <Button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className="w-full h-12 text-base font-medium"
        size="lg"
      >
        {isUploading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading…
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload & Extract Data
          </span>
        )}
      </Button>
    </div>
  );
};

export default UploadDragger;
