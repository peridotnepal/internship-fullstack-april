// components/MonthSelector.tsx
'use client';

import { useState } from 'react';

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + 1);
    onMonthChange(newDate);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const monthYearString = currentMonth.toLocaleString('default', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={goToPreviousMonth}
        className="p-2 rounded-xl bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
        aria-label="Previous month"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-amber-200 rounded-xl text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors min-w-[160px] justify-center"
        >
          <span className="text-base">📅</span>
          <span>{monthYearString}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-amber-100 z-20 p-4">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(currentMonth.getFullYear(), i, 1);
                  const isCurrent = i === currentMonth.getMonth();
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        onMonthChange(monthDate);
                        setIsOpen(false);
                      }}
                      className={`px-2 py-2 text-sm rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-amber-100 text-amber-700 font-medium'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {monthDate.toLocaleString('default', { month: 'short' })}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  goToCurrentMonth();
                  setIsOpen(false);
                }}
                className="w-full mt-3 text-center text-xs text-amber-500 hover:text-amber-600 py-1"
              >
                Today
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={goToNextMonth}
        className="p-2 rounded-xl bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
        aria-label="Next month"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}