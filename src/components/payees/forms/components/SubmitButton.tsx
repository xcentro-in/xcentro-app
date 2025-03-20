
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isSubmitting} className="h-11 px-6">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Saving Payee...
          </>
        ) : (
          <>Save Bank Payee</>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
