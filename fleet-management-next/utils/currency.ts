import { cache } from 'react';

interface CurrencySettings {
  symbol: string;
  position: 'before' | 'after';
  decimalSeparator: string;
  thousandsSeparator: string;
  decimalPlaces: number;
}

// Cache the currency settings to avoid multiple API calls
export const getCurrencySettings = cache(async (): Promise<CurrencySettings> => {
  try {
    const response = await fetch('/api/settings');
    const settings = await response.json();
    
    // Find currency settings
    const currencySymbol = settings.find((s: any) => s.key === 'currency.symbol')?.value || '$';
    const currencyPosition = settings.find((s: any) => s.key === 'currency.position')?.value || 'before';
    const decimalSeparator = settings.find((s: any) => s.key === 'currency.decimalSeparator')?.value || '.';
    const thousandsSeparator = settings.find((s: any) => s.key === 'currency.thousandsSeparator')?.value || ',';
    const decimalPlaces = Number(settings.find((s: any) => s.key === 'currency.decimalPlaces')?.value) || 2;

    return {
      symbol: currencySymbol,
      position: currencyPosition as 'before' | 'after',
      decimalSeparator,
      thousandsSeparator,
      decimalPlaces,
    };
  } catch (error) {
    console.error('Error fetching currency settings:', error);
    // Return default settings if there's an error
    return {
      symbol: '$',
      position: 'before',
      decimalSeparator: '.',
      thousandsSeparator: ',',
      decimalPlaces: 2,
    };
  }
});

export const formatCurrency = async (amount: number): Promise<string> => {
  const settings = await getCurrencySettings();
  
  // Format the number with the correct decimal places
  const formattedNumber = amount.toFixed(settings.decimalPlaces);
  
  // Split into whole and decimal parts
  const [whole, decimal] = formattedNumber.split('.');
  
  // Add thousands separators to the whole part
  const wholeWithSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, settings.thousandsSeparator);
  
  // Combine parts with the correct decimal separator
  const formattedAmount = `${wholeWithSeparators}${settings.decimalSeparator}${decimal}`;
  
  // Add the currency symbol in the correct position
  return settings.position === 'before'
    ? `${settings.symbol}${formattedAmount}`
    : `${formattedAmount}${settings.symbol}`;
}; 