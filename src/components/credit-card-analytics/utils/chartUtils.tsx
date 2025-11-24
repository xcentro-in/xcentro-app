
import React from "react";

// Define vibrant colors for charts
export const CARD_COLORS = [
  "#3b82f6", // blue-500
  "#ef4444", // red-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
];

// Function to format currency
import { formatCurrency as currencyFormatter } from '@/utils/formatters';

export const formatCurrency = (value: unknown): string => {
  // Handle array case (as ValueType can be an array)
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
  
  return currencyFormatter(numValue);
};
