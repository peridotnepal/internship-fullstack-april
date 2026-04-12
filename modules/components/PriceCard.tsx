// components/PriceCard.tsx
'use client';

import { Metal, Unit } from '@/lib/metals';

interface PriceCardProps {
  metal: Metal;
  price: number;
  unit: Unit;
  isHistorical?: boolean;
}

export default function PriceCard({ metal, price, unit, isHistorical = false }: PriceCardProps) {
  const priceChange = metal.dailyChange;
  const isPositive = priceChange >= 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100">
      {/* Decorative gradient bar */}
      <div className={`h-1 w-full ${metal.gradient}`} />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl ${metal.bgColor} flex items-center justify-center text-3xl`}>
              {metal.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{metal.name}</h3>
              <p className="text-xs text-slate-400 uppercase tracking-wide">{metal.code}</p>
            </div>
          </div>
          {!isHistorical && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <span>{isPositive ? '▲' : '▼'}</span>
              <span>{Math.abs(priceChange).toFixed(2)}%</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-slate-800">
              {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-slate-400 ml-1">USD</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-slate-400">per</span>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
              {unit.name}
            </span>
          </div>
        </div>

        {/* Additional Info - Live indicator */}
        {!isHistorical && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[11px] text-slate-400">Live</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Last updated: just now
            </div>
          </div>
        )}

        {/* Historical badge */}
        {isHistorical && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[11px] text-amber-500 flex items-center justify-center gap-1">
              <span>📅</span>
              <span>Historical data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}