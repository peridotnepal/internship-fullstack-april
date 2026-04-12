// components/UnitSelector.tsx
'use client';

import { useState } from 'react';
import { Unit } from '@/lib/metals';

interface UnitSelectorProps {
  selectedUnit: Unit;
  onUnitChange: (unit: Unit) => void;
  units: Unit[];
}

export default function UnitSelector({ selectedUnit, onUnitChange, units }: UnitSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
      >
        <span className="text-base">⚖️</span>
        <span>{selectedUnit.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-amber-100 z-20 overflow-hidden">
            {units.map(unit => (
              <button
                key={unit.id}
                onClick={() => {
                  onUnitChange(unit);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                  selectedUnit.id === unit.id
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{unit.name}</span>
                {selectedUnit.id === unit.id && (
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}