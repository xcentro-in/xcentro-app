
import { getCurrentLocale } from '@/config/locale';
import { format, isThisYear } from 'date-fns';

export const formatCurrency = (amount: number, isPrecise: boolean = false): string => {
  const { currency, locale } = getCurrentLocale();
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: (isPrecise)? 2 : 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Return just the date and month if it's current year
  if (isThisYear(dateObj)) {
    return format(dateObj, "d MMMM, h:mm aaa");
  }
  
  // Include the year if it's a different year
  return format(dateObj, "d MMMM yyyy, h:mm aaa");
};
