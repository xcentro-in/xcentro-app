
import { Star, StarOff } from "lucide-react";
import { Payee } from "@/types/payee";
import { getPayeeIcon } from "@/utils/payeeUtils";

interface PayeeItemProps {
  payee: Payee;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (payeeId: string) => void;
  onToggleFavorite: (payeeId: string) => void;
}

const PayeeItem = ({ 
  payee, 
  isSelected, 
  isFavorite, 
  onSelect, 
  onToggleFavorite 
}: PayeeItemProps) => {
  return (
    <div 
      className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-accent ${isSelected ? 'bg-accent' : ''}`}
      onClick={() => onSelect(payee.id)}
    >
      <div className="flex items-center gap-2">
        {getPayeeIcon(payee.type)}
        <div>
          <div className="font-medium">{payee.name}</div>
          <div className="text-xs text-muted-foreground">{payee.email}</div>
        </div>
      </div>
      <div className="flex items-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(payee.id);
          }}
          className="p-1 hover:bg-muted rounded-full focus:outline-none"
        >
          {isFavorite ? (
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PayeeItem;
