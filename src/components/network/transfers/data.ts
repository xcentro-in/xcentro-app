
export interface TransferHistoryItem {
  id: string;
  recipient: string;
  email: string;
  points: number;
  date: string;
  status: "success" | "pending" | "failed";
}

// Mock data for transfer history
export const transferHistoryData: TransferHistoryItem[] = [
  { 
    id: "1",
    recipient: "XYZ Enterprises",
    email: "accounts@xyzenterprises.com",
    points: 1200,
    date: "Apr 2, 2025",
    status: "success"
  },
  {
    id: "2",
    recipient: "New Venture LLC",
    email: "finance@newventure.com",
    points: 800,
    date: "Mar 28, 2025",
    status: "pending"
  },
  {
    id: "3",
    recipient: "Tech Solutions Inc.",
    email: "admin@techsolutions.com",
    points: 1500,
    date: "Mar 25, 2025",
    status: "success"
  }
];
