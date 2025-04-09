
export type LocaleConfig = {
  currency: string;
  locale: string;
};

export const defaultLocale: LocaleConfig = {
  currency: 'INR',
  locale: 'en-IN'
};

// This can be extended later to load from user preferences
export const getCurrentLocale = (): LocaleConfig => {
  // TODO: Get from user settings when implemented
  return defaultLocale;
};
