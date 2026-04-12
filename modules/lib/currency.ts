// lib/currencies.ts
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isDefault: boolean;
}

// 6 key currencies highlighted by default
export const defaultCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0000, isDefault: true },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.9200, isDefault: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.7900, isDefault: true },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 148.5000, isDefault: true },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.3500, isDefault: true },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.5200, isDefault: true },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', rate: 0.8800, isDefault: false },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.2000, isDefault: false },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.5000, isDefault: false },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.0000, isDefault: false },
];

export const getInitialRates = (): Record<string, number> => {
  const rates: Record<string, number> = {};
  defaultCurrencies.forEach(c => {
    rates[c.code] = c.rate;
  });
  return rates;
}
