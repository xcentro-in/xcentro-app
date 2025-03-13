
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface TransactionDetailCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  padding?: "none" | "normal";
}

export const TransactionDetailCard = ({
  title,
  children,
  className,
  padding = "normal"
}: TransactionDetailCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className={padding === "none" ? "p-0" : undefined}>
        {children}
      </CardContent>
    </Card>
  );
};
