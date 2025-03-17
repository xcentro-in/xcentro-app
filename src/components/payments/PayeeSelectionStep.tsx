
import { Button } from "@/components/ui/button";
import PayeeSelector from "./PayeeSelector";

interface PayeeSelectionStepProps {
  selectedPayee: string | undefined;
  setSelectedPayee: (payeeId: string) => void;
  favoritePayees: string[];
  toggleFavorite: (payeeId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const PayeeSelectionStep = ({
  selectedPayee,
  setSelectedPayee,
  favoritePayees,
  toggleFavorite,
  onBack,
  onNext
}: PayeeSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <PayeeSelector
        selectedPayee={selectedPayee}
        setSelectedPayee={setSelectedPayee}
        favoritePayees={favoritePayees}
        toggleFavorite={toggleFavorite}
      />

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1" disabled={!selectedPayee}>Continue to Payment Method</Button>
      </div>
    </div>
  );
};

export default PayeeSelectionStep;
