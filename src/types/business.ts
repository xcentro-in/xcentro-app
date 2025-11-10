export interface Business {
    id: string;
    bid: string;
    name: string;
    gstin: string;
    pan: string;
    businessType: string;
    userRole: string;
    status: 'verified' | 'pending';
  }
  