
import { useState } from "react";
import PayeeTags from "./components/PayeeTags";
import BankDetailsSection from "./components/BankDetailsSection";
import SubmitButton from "./components/SubmitButton";

interface BankPayeeFormProps {
  onSubmit: () => void;
}

const BankPayeeForm = ({ onSubmit }: BankPayeeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isValidatingIfsc, setIsValidatingIfsc] = useState(false);
  const [ifscValid, setIfscValid] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const handleIfscChange = (value: string) => {
    setIfscCode(value);
    if (value.length === 11) {
      // IFSC codes are 11 characters
      setIsValidatingIfsc(true);
      // Simulate IFSC validation
      setTimeout(() => {
        setIsValidatingIfsc(false);
        setIfscValid(true);
        setBankName("National Bank - Mumbai Branch"); // Auto-populated based on IFSC
      }, 1000);
    } else {
      setIfscValid(null);
      setBankName("");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tag selection section at the top for prominence */}
      <PayeeTags 
        selectedTags={selectedTags} 
        setSelectedTags={setSelectedTags} 
      />
      
      <BankDetailsSection 
        accountNumber={accountNumber}
        setAccountNumber={setAccountNumber}
        ifscCode={ifscCode}
        bankName={bankName}
        isValidatingIfsc={isValidatingIfsc}
        ifscValid={ifscValid}
        handleIfscChange={handleIfscChange}
      />
      
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default BankPayeeForm;
