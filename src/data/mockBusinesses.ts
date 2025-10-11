
export type BusinessStatus = "verified" | "pending";

export interface Business {
  id: string;
  name: string;
  type: string;
  model: string;
  turnover: string;
  pan: string;
  status: BusinessStatus;
  documents?: {
    cin?: string;
    deed?: string;
    other?: string[];
  };
}

export const mockBusinesses: Business[] = [
  {
    id: "b1",
    name: "ABC Company",
    type: "Private Limited Company",
    model: "B2B",
    turnover: "$500K - $1M",
    pan: "ABCDE1234F",
    status: "verified",
    documents: {
      cin: "L12345MH2020PTC123456"
    }
  },
  {
    id: "b2",
    name: "XYZ Enterprises",
    type: "Sole Proprietorship",
    model: "D2C",
    turnover: "$100K - $500K",
    pan: "XYZAB5678G",
    status: "verified",
    documents: {
      deed: "business_deed_xyz.pdf"
    }
  },
  {
    id: "b3",
    name: "New Venture LLC",
    type: "Limited Liability Partnership (LLP)",
    model: "B2C",
    turnover: "< $100K",
    pan: "NVPQR9012H",
    status: "pending",
    documents: {
      cin: "U67890DL2023LLP045678"
    }
  }
];

export const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "One Person Company (OPC)",
  "Section 8 Company (Non-profit)",
  "Foreign Company"
];

export const businessModels = [
  "B2B (Business to Business)",
  "B2C (Business to Consumer)",
  "D2C (Direct to Consumer)",
  "B2G (Business to Government)",
  "C2C (Consumer to Consumer)",
  "Marketplace",
  "SaaS (Software as a Service)",
  "Hybrid"
];

export const turnoverRanges = [
  "< ₹10 lakhs",
  "₹10 lakhs - ₹50 lakhs",
  "₹50 lakhs - ₹1 crore",
  "₹1 crore - ₹5 crores",
  "₹5 crores - ₹10 crores",
  "₹10 crores - ₹50 crores",
  "₹50 crores - ₹100 crores",
  "> ₹100 crores"
];
