
import { getCurrentLocale } from '@/config/locale';

export const formatCurrency = (amount: number): string => {
  const { currency, locale } = getCurrentLocale();
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(amount);
};
