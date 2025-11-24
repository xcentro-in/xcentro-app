/**
 * GST Rate Options
 *
 * Standard GST rates applicable in India as per GST law.
 * These rates apply to different categories of goods and services.
 */

export const GST_RATES = [
  { value: 0, label: '0% (Exempt)' },
  { value: 0.25, label: '0.25%' },
  { value: 3, label: '3%' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
] as const;

export type GSTRateValue = typeof GST_RATES[number]['value'];

/**
 * GST Type - determines how tax is split
 */
export const GST_TYPES = {
  CGST_SGST: 'cgst_sgst', // Intra-state: Central GST + State GST
  IGST: 'igst',            // Inter-state: Integrated GST
} as const;

export type GSTType = typeof GST_TYPES[keyof typeof GST_TYPES];
