
export interface ReferralItem {
  id: string;
  email: string;
  date: string;
  status: "joined" | "pending";
  points: number;
}

// Mock data for referrals
export const referralHistory: ReferralItem[] = [
  {
    id: "1",
    email: "deepak.singh@techfirm.com",
    date: "Apr 2, 2025",
    status: "joined",
    points: 500
  },
  {
    id: "2",
    email: "priya.kumar@financegroup.com",
    date: "Mar 29, 2025",
    status: "pending",
    points: 0
  },
  {
    id: "3",
    email: "rahul.sharma@retailco.com",
    date: "Mar 28, 2025",
    status: "joined",
    points: 500
  },
  {
    id: "4",
    email: "neha.patel@logisticsinc.com",
    date: "Mar 25, 2025",
    status: "pending",
    points: 0
  },
];
