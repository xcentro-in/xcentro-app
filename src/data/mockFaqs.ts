
import { FAQ } from "@/types/support";

export const mockFaqs: FAQ[] = [
  {
    id: "faq-1",
    question: "How do I add a new payee?",
    answer: "To add a new payee, go to the 'Manage Payees' section from the sidebar menu. Click the 'Add Payee' button and fill in the required information. You can add payees as banks, billers, or payroll recipients depending on your needs.",
    category: "payments",
    popular: true
  },
  {
    id: "faq-2",
    question: "How do I convert Xcentro points into airline miles?",
    answer: "To convert your reward points to airline miles, go to the 'Rewards' section, then click 'Redeem' and select the airline loyalty program you'd like to transfer your points to. In Settings > Rewards & Partners, you can link your frequent flyer accounts to enable seamless transfers.",
    category: "rewards",
    popular: true
  },
  {
    id: "faq-3",
    question: "How do I invite team members to my business account?",
    answer: "To invite team members, go to Settings > User Access. Click 'Add User' and enter their email address along with the role you want to assign them. They'll receive an invitation email with instructions to set up their account and access your business dashboard.",
    category: "users",
    popular: true
  },
  {
    id: "faq-4",
    question: "How do I link my credit card?",
    answer: "To link a credit card, go to the 'Wallet' section from the sidebar. Click 'Add Payment Method' and select 'Credit Card'. Follow the secure form to enter your card details. All sensitive information is encrypted and processed securely through our payment processor.",
    category: "wallet",
    popular: true
  },
  {
    id: "faq-5",
    question: "What happens if I forget my 2FA code?",
    answer: "If you forget your 2FA code, you can use the backup codes provided when you first set up 2FA. If you don't have access to these codes, contact support with proof of identity, and we'll help you recover access to your account through our secure identity verification process.",
    category: "security",
    popular: true
  },
  {
    id: "faq-6",
    question: "How long does it take for payments to process?",
    answer: "Payment processing times vary by method: ACH transfers typically take 1-3 business days, while credit card payments process immediately. International wire transfers may take 3-5 business days. Real-time payments (RTP) are processed within seconds if both financial institutions support this feature.",
    category: "payments"
  },
  {
    id: "faq-7",
    question: "Can I schedule recurring payments?",
    answer: "Yes, you can schedule recurring payments. When creating a new payment, select the 'Make this a recurring payment' option and specify the frequency (weekly, monthly, quarterly, etc.) and duration. You can manage all your scheduled payments from the Payments section.",
    category: "payments"
  },
  {
    id: "faq-8",
    question: "How are rewards points calculated?",
    answer: "Rewards points are calculated based on your spending: standard transactions earn 1 point per $1 spent, while certain categories like office supplies or travel may earn 1.5-3x points. Business-specific bonus categories rotate quarterly and are announced in the rewards dashboard.",
    category: "rewards"
  },
  {
    id: "faq-9",
    question: "When do my rewards points expire?",
    answer: "Reward points expire 24 months after they're earned if not redeemed. Points earned through special promotions may have different expiration policies, which will be specified in the promotion terms. You can view your points' expiration dates in the Rewards section.",
    category: "rewards"
  },
  {
    id: "faq-10",
    question: "How do I change a user's permissions?",
    answer: "To change a user's permissions, go to Settings > User Access and find the user in the list. Click the 'Edit' button next to their name and adjust their role or specific permissions. Changes take effect immediately, and the user will be notified of their updated access level.",
    category: "users"
  },
  {
    id: "faq-11",
    question: "How do I remove a user from my account?",
    answer: "To remove a user, go to Settings > User Access, find the user in the list, and click the 'Remove' button. You'll be asked to confirm this action. Once removed, the user will immediately lose access to your business account and receive a notification email.",
    category: "users"
  },
  {
    id: "faq-12",
    question: "How do I update my payment methods?",
    answer: "To update payment methods, go to the Wallet section. For each payment method, you'll see an 'Edit' option. Click it to update details like expiration dates for cards or account information for bank accounts. For security, some changes may require re-verification.",
    category: "wallet"
  },
  {
    id: "faq-13",
    question: "Is there a limit to how many payment methods I can add?",
    answer: "Business accounts can add up to 10 payment methods, including credit cards, bank accounts, and other payment options. If you need to add more than this limit, please contact our support team to discuss your business requirements.",
    category: "wallet"
  },
  {
    id: "faq-14",
    question: "How do I enable two-factor authentication?",
    answer: "To enable two-factor authentication, go to Settings > Security, and select 'Two-Factor Authentication'. Choose your preferred method (authenticator app, SMS, or email). Follow the on-screen instructions to complete setup, and be sure to save your backup codes in a secure location.",
    category: "security"
  },
  {
    id: "faq-15",
    question: "What should I do if I suspect unauthorized activity?",
    answer: "If you suspect unauthorized activity, immediately go to Settings > Security and select 'Lock Account'. Then contact our security team at security@Xcentro.com or call our emergency line at 1-800-555-9876. We'll help investigate and secure your account.",
    category: "security"
  }
];
