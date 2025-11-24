
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

interface BankDetailsSectionProps {
  payeeName: string;
  setPayeeName: (value: string) => void;
  gstin: string;
  setGstin: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  ifscCode: string;
  bankName: string;
  bankAddress: string;
  email: string;
  setEmail: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  isValidatingIfsc: boolean;
  ifscValid: boolean | null;
  handleIfscChange: (value: string) => void;
}

const BankDetailsSection = ({
  payeeName,
  setPayeeName,
  gstin,
  setGstin,
  accountNumber,
  setAccountNumber,
  ifscCode,
  bankName,
  bankAddress,
  email,
  setEmail,
  contactNumber,
  setContactNumber,
  isValidatingIfsc,
  ifscValid,
  handleIfscChange
}: BankDetailsSectionProps) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="payeeName" className="text-sm font-medium">Payee Name (Business/Individual)</Label>
            <Input
              id="payeeName"
              placeholder="Enter payee name"
              value={payeeName}
              onChange={e => setPayeeName(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="gstin" className="text-sm font-medium">GSTIN</Label>
            <Input
              id="gstin"
              placeholder="Enter GSTIN number"
              value={gstin}
              onChange={e => setGstin(e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2.5">
            <Label htmlFor="accountNumber" className="text-sm font-medium">Bank Account Number</Label>
            <Input 
              id="accountNumber" 
              placeholder="Enter account number" 
              value={accountNumber} 
              onChange={e => setAccountNumber(e.target.value)} 
              required 
              className="h-11"
            />
          </div>
          
          <div className="space-y-2.5">
            <Label htmlFor="ifscCode" className="text-sm font-medium">IFSC Code</Label>
            <div className="relative">
              <Input
                id="ifscCode"
                placeholder="Enter IFSC code"
                value={ifscCode}
                onChange={e => handleIfscChange(e.target.value.toUpperCase())}
                maxLength={11}
                className={`h-11 pr-10 ${ifscValid === true ? "border-green-500" : ifscValid === false ? "border-red-500" : ""}`}
                required
              />
              {isValidatingIfsc && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-muted-foreground" />}
              {ifscValid === true && <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />}
            </div>
            {ifscValid === false && (
              <p className="text-xs text-red-500 mt-1">Invalid IFSC code. Please check and try again.</p>
            )}
          </div>
          
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="bankName" className="text-sm font-medium">Bank Name & Branch</Label>
            <Input
              id="bankName"
              placeholder="Auto-populated from IFSC"
              value={bankName}
              readOnly
              className="h-11 bg-muted"
            />
            {bankAddress && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs font-medium text-blue-900 mb-1">Branch Address:</p>
                <p className="text-xs text-blue-700">{bankAddress}</p>
              </div>
            )}
            {!bankAddress && (
              <p className="text-xs text-muted-foreground mt-1">This will be auto-filled based on IFSC code</p>
            )}
          </div>
          
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium">Email Address (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="For payment notifications"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="contactNumber" className="text-sm font-medium">Contact Number (Optional)</Label>
            <Input
              id="contactNumber"
              placeholder="For payment notifications"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsSection;
