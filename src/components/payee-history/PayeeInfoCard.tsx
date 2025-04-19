
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PayeeInfo {
  label: string;
  value: string;
}

interface PayeeInfoCardProps {
  info: PayeeInfo[];
}

export const PayeeInfoCard = ({ info }: PayeeInfoCardProps) => {
  // Get basic info (everything except total paid and last payment)
  const basicInfo = info.slice(0, -2);
  // Get payment info (total paid and last payment)
  const paymentInfo = info.slice(-2);

  return (
    <Card className="bg-white border rounded-lg">
      <CardContent className="flex gap-6 p-6">
        <div className="flex-1 space-y-6">
          {basicInfo.map((item, index) => (
            <div key={index}>
              <p className="text-gray-600 text-sm mb-1">{item.label}</p>
              <p className="text-2xl font-normal text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
        
        <Separator orientation="vertical" />
        
        <div className="flex-1 space-y-6">
          {paymentInfo.map((item, index) => (
            <div key={index}>
              <p className="text-gray-600 text-sm mb-1">{item.label}</p>
              <p className="text-2xl font-normal text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
