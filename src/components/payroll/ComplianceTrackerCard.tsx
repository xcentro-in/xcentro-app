
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface ComplianceData {
  name: string;
  deducted: number;
  deposited: number;
  due: string;
  status: string;
}

interface ComplianceTrackerCardProps {
  complianceData: ComplianceData[];
}

const ComplianceTrackerCard: React.FC<ComplianceTrackerCardProps> = ({
  complianceData
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Compliance Tracker</CardTitle>
        <CardDescription>Monthly statutory deductions status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Deducted</TableHead>
                <TableHead>Deposited</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complianceData.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{formatCurrency(item.deducted)}</TableCell>
                  <TableCell>{formatCurrency(item.deposited)}</TableCell>
                  <TableCell>{item.due}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Completed" ? "outline" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTrackerCard;
