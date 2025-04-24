
import { getCurrentLocale } from '@/config/locale';
import { format, isThisYear } from 'date-fns';

export const formatCurrency = (amount: number, isPrecise: boolean = false): string => {
  // TODO: add more edge cases into formatter
  /**
   * // Handle array case (as ValueType can be an array)
  if (Array.isArray(value)) {
    if (value.length > 0) {
      return formatCurrency(value[0]);
    }
    return currencyFormatter(0);
  }
  
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  
  // Check if value is a valid number
  if (isNaN(numValue)) return currencyFormatter(0);
  
  return currencyFormatter(numValue);;
   */
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
