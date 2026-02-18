import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setCustomPageId } from '@/lib/analytics';

// Maps static routes to a human-readable Clarity page label.
// Dynamic segments are handled by the pattern matching below.
const STATIC_PAGE_IDS: Record<string, string> = {
  '/':                        'dashboard',
  '/new-payment':             'new-payment',
  '/payment-calendar':        'payment-calendar',
  '/payments':                'payment-history',
  '/payees':                  'payees',
  '/bills':                   'bills',
  '/bills/new':               'new-bill',
  '/approvals':               'approvals',
  '/insights':                'insights',
  '/cash-flow-projection':    'cash-flow-projection',
  '/gst-reports':             'gst-reports',
  '/gst-payment-history':     'gst-payment-history',
  '/payroll-report':          'payroll-report',
  '/wallet':                  'wallet',
  '/wallet/add':              'wallet-add-method',
  '/credit-cards':            'credit-cards',
  '/credit-card-bills':       'credit-card-bills',
  '/credit-card-analytics':   'credit-card-analytics',
  '/rewards':                 'rewards',
  '/rewards/history':         'rewards-history',
  '/rewards/milestones':      'rewards-milestones',
  '/settings':                'settings',
};

const resolvePageId = (pathname: string): string => {
  // Exact match first
  if (STATIC_PAGE_IDS[pathname]) return STATIC_PAGE_IDS[pathname];

  // Dynamic routes — order matters (most-specific first)
  if (pathname.startsWith('/bills/'))        return 'bill-detail';
  if (pathname.startsWith('/payees/'))       return 'payee-history';
  if (pathname.startsWith('/payments/'))     return 'transaction-detail';
  if (pathname.startsWith('/rewards/'))      return 'rewards';
  if (pathname.startsWith('/settings'))      return 'settings';

  return 'unknown';
};

/**
 * Fires setCustomPageId on every route change.
 * Must be rendered inside <Router> — use the <PageTracker /> wrapper in App.tsx.
 */
export const usePageTracking = (): void => {
  const location = useLocation();

  useEffect(() => {
    setCustomPageId(resolvePageId(location.pathname));
  }, [location.pathname]);
};
