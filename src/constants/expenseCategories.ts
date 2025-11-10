/**
 * Expense Categories for Bill Classification
 *
 * Used in bill creation and categorization for better financial reporting
 * and expense tracking.
 */

export const EXPENSE_CATEGORIES = [
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'rent', label: 'Rent' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'travel', label: 'Travel & Accommodation' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'software_saas', label: 'Software & SaaS' },
  { value: 'raw_materials', label: 'Raw Materials' },
  { value: 'repairs_maintenance', label: 'Repairs & Maintenance' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'freight_logistics', label: 'Freight & Logistics' },
  { value: 'salary_wages', label: 'Salary & Wages' },
  { value: 'consulting', label: 'Consulting Fees' },
  { value: 'legal_compliance', label: 'Legal & Compliance' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
] as const;

export type ExpenseCategoryValue = typeof EXPENSE_CATEGORIES[number]['value'];
