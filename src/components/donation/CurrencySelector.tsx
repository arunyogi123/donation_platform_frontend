import React from 'react';
import { Currency } from '../../types';

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'NPR', label: 'Nepalese Rupee', symbol: 'Rs.' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  ];

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E]">
        Select Currency
      </label>
      <div className="grid grid-cols-3 gap-2">
        {currencies.map((curr) => {
          const isSelected = value === curr.code;
          return (
            <button
              key={curr.code}
              type="button"
              onClick={() => onChange(curr.code)}
              className={`py-2 px-3 text-xs font-medium rounded-md border transition-all text-center ${
                isSelected
                  ? 'border-[#0D5C3A] bg-[#0D5C3A]/5 text-[#0D5C3A] font-semibold'
                  : 'border-[#D6D3D1] bg-white text-[#44403C] hover:border-[#A8A29E]'
              }`}
            >
              <div className="font-mono text-sm">{curr.code}</div>
              <div className="text-[10px] text-[#78716C]">{curr.symbol}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
