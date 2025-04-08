
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { transferHistoryData } from "./data";

const TransferHistory = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Transfer History</h3>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferHistoryData.length > 0 ? (
              transferHistoryData.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div>{transfer.recipient}</div>
                    <div className="text-xs text-muted-foreground">{transfer.email}</div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {transfer.points.toLocaleString()}
                  </TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transfer.status === "success" ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Success</span>
                        </>
                      ) : transfer.status === "pending" ? (
                        <>
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span className="text-amber-600">Pending</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">Failed</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transfer history
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransferHistory;
