
import { 
  Home, 
  CreditCard, 
  PanelRight, 
  Wallet, 
  BarChart3, 
  Gift, 
  Globe, 
  CalendarDays, 
  Settings, 
  Users,
  ReceiptText,
  TrendingUp
} from 'lucide-react';

export const sidebarMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    href: '/payments',
  },
  {
    id: 'approvals',
    label: 'Approvals',
    icon: PanelRight,
    href: '/approvals',
    badge: '12',
    badgeColor: 'amber',
  },
  {
    id: 'payees',
    label: 'Payees',
    icon: Users,
    href: '/payees',
  },
  {
    id: 'payment-calendar',
    label: 'Calendar',
    icon: CalendarDays,
    href: '/payment-calendar',
  },
  {
    id: 'gst-reports',
    label: 'GST Reports',
    icon: ReceiptText,
    href: '/gst-reports',
  },
  {
    id: 'cash-flow-projection',
    label: 'Cash Flow',
    icon: TrendingUp,
    href: '/cash-flow-projection',
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: BarChart3,
    href: '/insights',
  },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: Gift,
    href: '/rewards',
  },
  {
    id: 'network',
    label: 'Network',
    icon: Globe,
    href: '/network',
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: Wallet, 
    href: '/wallet',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];
