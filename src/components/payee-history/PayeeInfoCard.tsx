
import { Card, CardContent } from "@/components/ui/card";

interface PayeeInfo {
  label: string;
  value: string;
}

interface PayeeInfoCardProps {
  info: PayeeInfo[];
}

export const PayeeInfoCard = ({ info }: PayeeInfoCardProps) => (
  <Card className="bg-slate-50/50">
    <CardContent className="p-4">
      <div className="space-y-3">
        {info.map((item, index) => (
          <div key={index}>
            <p className="text-sm text-muted-foreground font-normal font-sans tracking-tight">{item.label}</p>
            <p className="text-base font-serif text-foreground">{item.value}</p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
