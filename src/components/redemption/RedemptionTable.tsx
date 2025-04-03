
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { RedemptionTypeIcon } from "./RedemptionTypeIcon";

export interface RedemptionItem {
  id: string;
  type: string;
  partner: string;
  date: string;
  points: number;
  value: number;
  status: string;
  referenceId: string;
}

interface RedemptionTableProps {
  data: RedemptionItem[];
}

export const RedemptionTable = ({ data }: RedemptionTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Type</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Points Used</TableHead>
            <TableHead className="text-right">Value (₹)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference ID</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <RedemptionTypeIcon type={item.type} />
                    {item.type}
                  </div>
                </TableCell>
                <TableCell>{item.partner}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className="text-right">{item.points.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{item.value.toLocaleString()}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="font-mono text-xs">{item.referenceId}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No redemption history matching the current filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
