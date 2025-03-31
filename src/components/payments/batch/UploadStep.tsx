
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadStepProps {
  onNext: () => void;
}

const UploadStep = ({ onNext }: UploadStepProps) => {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">Upload Batch Payment File</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a CSV or Excel file with payment details
          </p>
        </div>
        <Input type="file" className="mx-auto" />
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onNext} className="w-auto">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default UploadStep;
