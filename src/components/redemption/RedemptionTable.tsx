
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  // Filter to only show successful redemptions
  const successfulRedemptions = data.filter(item => item.status === "Successful");
  
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>Partner</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Points Used</TableHead>
            <TableHead>Reference ID</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {successfulRedemptions.length > 0 ? (
            successfulRedemptions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center justify-center">
                    <RedemptionTypeIcon type={item.type} />
                  </div>
                </TableCell>
                <TableCell>{item.partner}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell className="text-right text-red-500 font-medium">
                  -{item.points.toLocaleString()}
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
              <TableCell colSpan={6} className="h-24 text-center">
                No redemption history matching the current filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
