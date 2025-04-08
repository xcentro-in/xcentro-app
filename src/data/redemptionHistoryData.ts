
export interface RedemptionHistoryItem {
  id: string;
  type: string;
  partner: string;
  date: string;
  points: number;
  value: number;
  status: string;
  referenceId: string;
}

// Dummy data for redemption history
export const redemptionHistoryData: RedemptionHistoryItem[] = [
  {
    id: "RED001",
    type: "Flight",
    partner: "Air India",
    date: "Mar 10, 2025",
    points: 12500,
    value: 11250,
    status: "Successful",
    referenceId: "#REDEEM20250310001",
  },
  {
    id: "RED002",
    type: "Hotel",
    partner: "Taj Hotels",
    date: "Feb 28, 2025",
    points: 8000,
    value: 7200,
    status: "Processing",
    referenceId: "#REDEEM20250228002",
  },
  {
    id: "RED003",
    type: "Gift Card",
    partner: "Amazon",
    date: "Feb 15, 2025",
    points: 5000,
    value: 4500,
    status: "Successful",
    referenceId: "#REDEEM20250215003",
  },
  {
    id: "RED004",
    type: "Transfer",
    partner: "ABC Retail LLP",
    date: "Feb 10, 2025",
    points: 22000,
    value: 19800,
    status: "Successful",
    referenceId: "#REDEEM20250210004",
  },
  {
    id: "RED005",
    type: "Flight",
    partner: "Indigo Airlines",
    date: "Jan 25, 2025",
    points: 10000,
    value: 9000,
    status: "Failed",
    referenceId: "#REDEEM20250125005",
  },
  {
    id: "RED006",
    type: "Hotel",
    partner: "Marriott",
    date: "Jan 20, 2025",
    points: 15000,
    value: 13500,
    status: "Successful",
    referenceId: "#REDEEM20250120006",
  },
  {
    id: "RED007",
    type: "Gift Card",
    partner: "Flipkart",
    date: "Jan 15, 2025",
    points: 3000,
    value: 2700,
    status: "Successful",
    referenceId: "#REDEEM20250115007",
  },
  {
    id: "RED008",
    type: "Transfer",
    partner: "XYZ Corp Ltd",
    date: "Jan 05, 2025",
    points: 18000,
    value: 16200,
    status: "Successful",
    referenceId: "#REDEEM20250105008",
  },
];

// Data for charts
export const pieChartData = [
  { name: "Flights", value: 22500, fill: "#8884d8" },
  { name: "Hotels", value: 23000, fill: "#82ca9d" },
  { name: "Gift Cards", value: 8000, fill: "#ffc658" },
  { name: "Transfers", value: 40000, fill: "#ff8042" },
];

export const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export const lineChartData = [
  { name: "Oct", points: 15000 },
  { name: "Nov", points: 22000 },
  { name: "Dec", points: 18000 },
  { name: "Jan", points: 36000 },
  { name: "Feb", points: 35000 },
  { name: "Mar", points: 12500 },
];
