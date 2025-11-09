
import React from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardPaymentMethod } from '@/types/payment-method';

interface CreditCardDisplayProps {
  card: CardPaymentMethod;
  isSelected: boolean;
  onClick: () => void;
}

const CreditCardDisplay: React.FC<CreditCardDisplayProps> = ({ card, isSelected, onClick }) => {
  // Last four digits with masked prefix
  const maskedNumber = `•••• •••• •••• ${card.lastFourDigits}`;

  // Format MM/YY from card expiry date
  const expiry = card.expiryDate;

  return (
    <div 
      className={cn(
        "relative cursor-pointer transition-all hover:scale-105 mb-4",
        isSelected ? "ring-2 ring-primary" : ""
      )}
      onClick={onClick}
    >
      <Cards
        number={maskedNumber}
        preview={true}
        issuer={card.cardType}
        expiry={expiry}
        cvc="***"
        name={card.cardholderName}
        focused=""
      />
      
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center z-10">
          <div className="bg-green-500 text-white rounded-full p-1">
            <Check className="h-4 w-4" />
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 right-2 flex items-center z-10">
        {card.isDefault && (
          <span className="px-2 py-0.5 bg-black/50 text-white text-xs rounded-full">
            Default
          </span>
        )}
      </div>
    </div>
  );
};

export default CreditCardDisplay;
