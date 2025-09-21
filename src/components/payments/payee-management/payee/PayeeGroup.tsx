
import { Payee } from "@/types/payee";
import PayeeItem from "./PayeeItem";

interface PayeeGroupProps {
  title: string;
  payees: Payee[];
  selectedPayee: string | undefined;
  setSelectedPayee: (payeeId: string) => void;
  favoritePayees: string[];
  toggleFavorite: (payeeId: string) => void;
}

const PayeeGroup = ({ 
  title, 
  payees, 
  selectedPayee, 
  setSelectedPayee, 
  favoritePayees, 
  toggleFavorite 
}: PayeeGroupProps) => {
  if (payees.length === 0) return null;
  
  return (
    <div className="p-2">
      <h4 className="mb-2 text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="space-y-1">
        {payees.map(payee => (
          <PayeeItem
            key={payee.id}
            payee={payee}
            isSelected={selectedPayee === payee.id}
            isFavorite={favoritePayees.includes(payee.id)}
            onSelect={setSelectedPayee}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default PayeeGroup;
