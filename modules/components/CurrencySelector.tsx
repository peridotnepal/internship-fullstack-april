// components/CurrencySelector.tsx
'use client';

import { useState } from 'react';
import { Currency } from '@/lib/currencies';

interface CurrencySelectorProps {
  availableCurrencies: Currency[];
  onAddCurrency: (code: string) => void;
}

export default function CurrencySelector({ availableCurrencies, onAddCurrency }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCurrencies = availableCurrencies.filter(c =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (code: string) => {
    onAddCurrency(code);
    setIsOpen(false);
    setSearchTerm('');
  };

  if (availableCurrencies.length === 0) {
    return (
      <div className="text-sm text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
        All currencies added
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors text-sm font-medium shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Currency
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 z-20 overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                autoFocus
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredCurrencies.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No currencies found
                </div>
              ) : (
                filteredCurrencies.map(currency => (
                  <button
                    key={currency.code}
                    onClick={() => handleSelect(currency.code)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{currency.symbol}</span>
                      <div>
                        <div className="font-medium text-slate-700">{currency.code}</div>
                        <div className="text-xs text-slate-400">{currency.name}</div>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}