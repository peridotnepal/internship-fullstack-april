
// components/CurrencyCard.tsx
'use client';

import { useState } from 'react';
import { Currency } from '@/lib/currencies';

interface CurrencyCardProps {
  currency: Currency;
  baseCurrency: string;
  baseRate: number;
  onRateChange: (code: string, newRate: number) => void;
  onRemove: (code: string) => void;
}

export default function CurrencyCard({
  currency,
  baseCurrency,
  baseRate,
  onRateChange,
  onRemove,
}: CurrencyCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currency.rate.toString());

  const displayRate = currency.rate / baseRate;
  const isHighlighted = currency.isDefault;

  const handleEditStart = () => {
    setEditValue(currency.rate.toString());
    setIsEditing(true);
  };

  const handleEditSave = () => {
    const newRate = parseFloat(editValue);
    if (!isNaN(newRate) && newRate > 0) {
      onRateChange(currency.code, newRate);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditValue(currency.rate.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className={`
      group relative rounded-2xl p-6 transition-all duration-200
      ${isHighlighted 
        ? 'bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200 shadow-md' 
        : 'bg-white border border-slate-200 hover:shadow-md'
      }
    `}>
      {/* Remove button */}
      <button
        onClick={() => onRemove(currency.code)}
        className="absolute top-3 right-3 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove ${currency.code}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Currency Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold
            ${isHighlighted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}
          `}>
            {currency.symbol}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{currency.code}</h3>
            <p className="text-xs text-slate-400">{currency.name}</p>
          </div>
        </div>
        {isHighlighted && (
          <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Rate Display / Edit */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-slate-500">
            1 {baseCurrency} =
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.0001"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-28 px-2 py-1 text-right text-lg font-mono font-semibold border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoFocus
              />
              <button
                onClick={handleEditSave}
                className="p-1 text-green-600 hover:text-green-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={handleEditCancel}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={handleEditStart}
              className="group/rate cursor-pointer flex items-center gap-2 px-2 py-1 -m-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <span className="text-2xl font-mono font-bold text-slate-800">
                {displayRate.toFixed(4)}
              </span>
              <span className="text-sm font-medium text-slate-500">{currency.code}</span>
              <svg className="w-4 h-4 text-slate-400 opacity-0 group-hover/rate:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Inverse rate */}
        <div className="mt-2 text-xs text-slate-400">
          1 {currency.code} = {(1 / displayRate).toFixed(4)} {baseCurrency}
        </div>
      </div>

      {/* Last updated placeholder */}
      <div className="mt-4 text-[10px] text-slate-300 flex justify-between items-center">
        <span>Rate: {currency.rate.toFixed(4)} (base value)</span>
        <span>Click rate to edit</span>
      </div>
    </div>
  );
}