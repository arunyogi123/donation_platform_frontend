import React from 'react';
import { Currency } from '../../types';

interface DonationAmountProps {
  amount: number;
  customAmount: string;
  currency: Currency;
  onAmountChange: (amount: number, customStr: string) => void;
}

export const DonationAmount: React.FC<DonationAmountProps> = ({
  amount,
  customAmount,
  currency,
  onAmountChange,
}) => {
  // Preset amounts based on currency
  const presets =
    currency === 'USD'
      ? [15, 25, 50, 100]
      : [500, 1000, 2500, 5000];

  const isPresetSelected = (val: number) => !customAmount && amount === val;

  const handlePresetClick = (val: number) => {
    onAmountChange(val, '');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(val, 10);
    onAmountChange(isNaN(num) ? 0 : num, val);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E]">
        Choose Amount
      </label>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {presets.map((val) => {
          const selected = isPresetSelected(val);
          return (
            <button
              key={val}
              type="button"
              onClick={() => handlePresetClick(val)}
              className={`py-3 px-2 rounded-md border text-center transition-all ${
                selected
                  ? 'border-[#0D5C3A] bg-[#0D5C3A] text-white font-semibold shadow-xs'
                  : 'border-[#D6D3D1] bg-white text-[#1C1917] hover:border-[#A8A29E]'
              }`}
            >
              <span className="text-xs text-[#78716C] mr-1">{currency}</span>
              <span className="font-semibold text-sm tabular-nums">{val.toLocaleString()}</span>
            </button>
          );
        })}
      </div>

      {/* Custom Amount Field */}
      <div className="pt-1">
        <div className="relative rounded-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-[#78716C]">
            {currency}
          </div>
          <input
            type="text"
            inputMode="numeric"
            value={customAmount}
            onChange={handleCustomChange}
            placeholder="Or enter custom amount"
            className={`block w-full rounded-md border py-2.5 pl-14 pr-4 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 ${
              customAmount && amount <= 0
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                : 'border-[#D6D3D1] bg-white focus:border-[#0D5C3A] focus:ring-[#0D5C3A]'
            }`}
          />
        </div>
        {amount <= 0 && (
          <p className="mt-1 text-xs text-red-600">Please choose or enter a valid donation amount.</p>
        )}
      </div>
    </div>
  );
};
