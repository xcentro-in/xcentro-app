export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorName: string;
  vendorAddress: string;
  amount: number;
  dueDate: string;
  billDate: string;
  status: 'paid' | 'open' | 'overdue';
  overdueDays?: number;
  gstin?: string;
  items: InvoiceItem[];
  cgst: number;
  sgst: number;
  igst?: number;
  terms: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const mockInvoices: Invoice[] = [
  {
    id: "4365656",
    invoiceNumber: "4365656",
    vendorName: "Jomon K Joseph",
    vendorAddress: "FLAT-410,PAVANI SAROVAR,PHASE 2, NALLURAHALLI\nWHITEFIELD\n560066 Karnataka\nIndia",
    amount: 1000.00,
    dueDate: "07/04/2023",
    billDate: "07/04/2023",
    status: "paid",
    gstin: "06AJYPM2998R3ZQ",
    items: [
      {
        description: "Consultancy Services",
        quantity: 1,
        rate: 847.46,
        amount: 847.46
      }
    ],
    cgst: 76.27,
    sgst: 76.27,
    terms: "Due on Receipt"
  },
  {
    id: "4645746",
    invoiceNumber: "4645746",
    vendorName: "Jomon K Joseph",
    vendorAddress: "FLAT-410,PAVANI SAROVAR,PHASE 2, NALLURAHALLI\nWHITEFIELD\n560066 Karnataka\nIndia",
    amount: 1120.00,
    dueDate: "08/04/2023",
    billDate: "08/04/2023",
    status: "open",
    gstin: "06AJYPM2998R3ZQ",
    items: [
      {
        description: "Development Services",
        quantity: 1,
        rate: 949.15,
        amount: 949.15
      }
    ],
    cgst: 85.42,
    sgst: 85.42,
    terms: "Due on Receipt"
  },
  {
    id: "4565",
    invoiceNumber: "4565",
    vendorName: "RELIABLE DIESELS",
    vendorAddress: "Industrial Area, Sector 12\nGurgaon, Haryana\nIndia",
    amount: 40000.00,
    dueDate: "06/04/2023",
    billDate: "06/04/2023",
    status: "overdue",
    overdueDays: 2,
    items: [
      {
        description: "Diesel Supply",
        quantity: 1000,
        rate: 33.90,
        amount: 33900.00
      }
    ],
    cgst: 3051.00,
    sgst: 3051.00,
    terms: "Net 30"
  },
  {
    id: "2354543",
    invoiceNumber: "2354543",
    vendorName: "SAHJANAND ELECTRIC",
    vendorAddress: "Electric Market, Phase 1\nMohali, Punjab\nIndia",
    amount: 35678.00,
    dueDate: "06/04/2023",
    billDate: "06/04/2023",
    status: "overdue",
    overdueDays: 2,
    items: [
      {
        description: "Electrical Equipment",
        quantity: 1,
        rate: 30236.44,
        amount: 30236.44
      }
    ],
    cgst: 2721.28,
    sgst: 2721.28,
    terms: "Net 30"
  },
  {
    id: "346456",
    invoiceNumber: "346456",
    vendorName: "Burhani Auto Glass",
    vendorAddress: "Auto Market, Sector 8\nFaridabad, Haryana\nIndia",
    amount: 10000.00,
    dueDate: "05/04/2023",
    billDate: "05/04/2023",
    status: "overdue",
    overdueDays: 3,
    items: [
      {
        description: "Auto Glass Replacement",
        quantity: 2,
        rate: 4237.29,
        amount: 8474.58
      }
    ],
    cgst: 762.71,
    sgst: 762.71,
    terms: "Net 15"
  }
];