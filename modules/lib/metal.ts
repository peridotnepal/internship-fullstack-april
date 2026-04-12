// lib/metals.ts
export interface Metal {
  code: string;
  name: string;
  icon: string;
  currentPricePerOunce: number;
  dailyChange: number;
  gradient: string;
  bgColor: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  factor: number;
}

export interface HistoricalRecord {
  date: Date;
  goldPrice: number | null;
  silverPrice: number | null;
}

export const defaultMetals: Metal[] = [
  {
    code: 'XAU',
    name: 'Gold',
    icon: '🥇',
    currentPricePerOunce: 2045.50,
    dailyChange: 0.42,
    gradient: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    bgColor: 'bg-amber-100',
  },
  {
    code: 'XAG',
    name: 'Silver',
    icon: '🥈',
    currentPricePerOunce: 23.85,
    dailyChange: -0.18,
    gradient: 'bg-gradient-to-r from-slate-400 to-gray-300',
    bgColor: 'bg-slate-100',
  },
];

export const defaultUnits: Unit[] = [
  { id: 'ounce', name: 'Troy Ounce', symbol: 'oz t', factor: 1 },
  { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.0321507 },
  { id: 'tola', name: 'Tola', symbol: 'tola', factor: 0.375 },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', factor: 32.1507 },
];

// Generate simulated historical data for a given month
export function getHistoricalRates(month: Date): HistoricalRecord[] {
  const records: HistoricalRecord[] = [];
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  
  // Base prices (volatile around current rates)
  const baseGold = 2045.50;
  const baseSilver = 23.85;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday) for market closure simulation
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    if (isWeekend) {
      records.push({ date, goldPrice: null, silverPrice: null });
      continue;
    }
    
    // Simulate price variation using sine wave + random noise
    const progress = (day - 1) / (daysInMonth - 1);
    const seasonalVariation = Math.sin(progress * Math.PI * 2) * 15;
    const randomVariationGold = (Math.sin(day * 0.7) * 8) + (Math.random() - 0.5) * 6;
    const randomVariationSilver = (Math.cos(day * 0.5) * 0.3) + (Math.random() - 0.5) * 0.2;
    
    let goldPrice = baseGold + seasonalVariation + randomVariationGold;
    let silverPrice = baseSilver + (seasonalVariation / 50) + randomVariationSilver;
    
    // Ensure realistic ranges
    goldPrice = Math.max(1980, Math.min(2120, goldPrice));
    silverPrice = Math.max(22.5, Math.min(25.5, silverPrice));
    
    records.push({
      date,
      goldPrice: parseFloat(goldPrice.toFixed(2)),
      silverPrice: parseFloat(silverPrice.toFixed(2)),
    });
  }
  
  return records;
}