
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'payments' | 'rewards' | 'users' | 'wallet' | 'security' | 'other';
  popular?: boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  contactMethod: 'email' | 'phone';
  contactInfo: string;
  attachments?: string[];
}
