/**
 * Payment Terms Options
 *
 * Standard payment terms that can be set on invoices/bills to define
 * when payment is due.
 */

export const PAYMENT_TERMS = [
  { value: 'due_on_receipt', label: 'Due on Receipt' },
  { value: 'net_7', label: 'Net 7 Days' },
  { value: 'net_10', label: 'Net 10 Days' },
  { value: 'net_15', label: 'Net 15 Days' },
  { value: 'net_30', label: 'Net 30 Days' },
  { value: 'net_45', label: 'Net 45 Days' },
  { value: 'net_60', label: 'Net 60 Days' },
  { value: 'net_90', label: 'Net 90 Days' },
  { value: 'eom', label: 'End of Month (EOM)' },
  { value: '2_10_net_30', label: '2/10 Net 30' },
  { value: 'custom', label: 'Custom Terms' },
] as const;

export type PaymentTermsValue = typeof PAYMENT_TERMS[number]['value'];
