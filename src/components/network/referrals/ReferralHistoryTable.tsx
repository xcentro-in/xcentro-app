
import { 
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow 
} from "@/components/ui/table";
import { BadgeCheck, Clock } from "lucide-react";

interface ReferralItem {
  id: string;
  email: string;
  date: string;
  status: string;
  points: number;
}

interface ReferralHistoryTableProps {
  referralHistory: ReferralItem[];
}

const ReferralHistoryTable = ({ referralHistory }: ReferralHistoryTableProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Referral History</h3>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Invited On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Points Earned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referralHistory.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.email}</TableCell>
                <TableCell>{referral.date}</TableCell>
                <TableCell>
                  {referral.status === "joined" ? (
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Joined</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span className="text-amber-600">Pending</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {referral.points > 0 ? (
                    <span className="font-medium text-green-600">
                      +{referral.points}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReferralHistoryTable;
