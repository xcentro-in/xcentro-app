import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format date for payment history table display
 * Examples: "4 Oct 2025 2:15 PM", "Today 2:15 PM", "Yesterday 10:30 AM"
 */
export const formatPaymentDate = (dateString: string | null | undefined): string => {
  // Handle null, undefined, or empty strings
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = parseISO(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    if (isToday(date)) {
      return `Today ${format(date, 'h:mm a')}`;
    }

    if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    }

    // For older dates: "4 Oct 2025 2:15 PM"
    return format(date, 'd MMM yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for relative display (notifications, recent activity)
 * Examples: "2 hours ago", "3 days ago", "2 weeks ago"
 */
export const formatRelativeDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = parseISO(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for compact display (cards, summaries)
 * Examples: "4 Oct", "Today", "Yesterday"
 */
export const formatCompactDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = parseISO(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    if (isToday(date)) {
      return 'Today';
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    // For other dates: "4 Oct"
    return format(date, 'd MMM');
  } catch (error) {
    console.error('Error formatting compact date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format date for form inputs (date pickers)
 * Examples: "2025-10-04"
 */
export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }

  try {
    const date = parseISO(dateString);

    if (isNaN(date.getTime())) {
      return '';
    }

    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Format time only (for same-day comparisons)
 * Examples: "2:15 PM", "10:30 AM"
 */
export const formatTimeOnly = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return 'N/A';
  }

  try {
    const date = parseISO(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Time';
    }

    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
};