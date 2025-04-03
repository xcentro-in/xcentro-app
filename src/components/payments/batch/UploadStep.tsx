
import { Upload, Import, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadStepProps {
  onNext: () => void;
}

const UploadStep = ({ onNext }: UploadStepProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <div className="flex flex-col items-center justify-center border rounded-lg p-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Import className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Import From Accounting Software</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Connect to your accounting software to import bills
              </p>
            </div>
            <Button>
              Import from Zoho Books
            </Button>
            <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2 max-w-md">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-left">
                Only bills with status "Awaiting Payment" will be listed. Make sure your bills are properly categorized in Zoho Books before importing.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4">
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
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default UploadStep;
