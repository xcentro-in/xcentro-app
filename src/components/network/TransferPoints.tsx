
import { useState } from "react";
import { TransferForm, TransferHistory, TransferLimitCard } from "./transfers";

const TransferPoints = () => {
  // Summary stats  
  const [availablePoints] = useState(24530);
  
  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold mb-2">Transfer Points</h2>
        <p className="text-muted-foreground">
          Send your points to other businesses you own or partner with.
        </p>
      </div>
      
      <TransferLimitCard availablePoints={availablePoints}>
        <TransferForm availablePoints={availablePoints} />
      </TransferLimitCard>
      
      <TransferHistory />
    </div>
  );
};

export default TransferPoints;
