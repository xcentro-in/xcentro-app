
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
  "One Person Company (OPC)",
  "Section 8 (Non-Profit)",
  "Trust",
  "NGO",
  "Society",
  "Cooperative Society",
  "Other"
];

// Backend enum mapping
export type BusinessTypeEnum =
  | "sole_proprietorship"
  | "partnership"
  | "limited_liability_partnership"
  | "private_limited_company"
  | "one_person_company"
  | "section_8_non_profit"
  | "trust"
  | "ngo"
  | "society"
  | "cooperative_society"
  | "other";

// Map UI display names to backend enum values
export const businessTypeToEnum: Record<string, BusinessTypeEnum> = {
  "Sole Proprietorship": "sole_proprietorship",
  "Partnership": "partnership",
  "Limited Liability Partnership (LLP)": "limited_liability_partnership",
  "Private Limited Company": "private_limited_company",
  "One Person Company (OPC)": "one_person_company",
  "Section 8 (Non-Profit)": "section_8_non_profit",
  "Trust": "trust",
  "NGO": "ngo",
  "Society": "society",
  "Cooperative Society": "cooperative_society",
  "Other": "other"
};

// Business types that require CIN (not deed upload)
export const businessTypesRequiringCIN = [
  "Private Limited Company",
  "One Person Company (OPC)",
  "Section 8 (Non-Profit)",
  "Limited Liability Partnership (LLP)"
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

// User role enum mapping (backend: xcentro.user_role_enum)
export type UserRoleEnum = "owner" | "admin" | "finance" | "support";

export const userRoles: { value: UserRoleEnum; label: string; description: string }[] = [
  { value: "owner", label: "Owner", description: "Full access to all business operations and settings" },
  { value: "admin", label: "Administrator", description: "Manage users, approve transactions, and configure settings" },
  { value: "finance", label: "Finance Manager", description: "Handle payments, invoices, and financial reporting" },
  { value: "support", label: "Support Staff", description: "View-only access with limited operational capabilities" }
];
