
import { Card, CardContent } from "@/components/ui/card";

interface PayeeInfo {
  label: string;
  value: string;
}

interface PayeeInfoCardProps {
  info: PayeeInfo[];
}

export const PayeeInfoCard = ({ info }: PayeeInfoCardProps) => (
  <Card className="bg-white border rounded-lg">
    <CardContent className="grid grid-cols-2 gap-x-8 gap-y-6 p-6">
      {info.map((item, index) => (
        <div key={index}>
          <p className="text-gray-600 text-sm mb-1">{item.label}</p>
          <p className="text-2xl font-normal text-gray-900">{item.value}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);
