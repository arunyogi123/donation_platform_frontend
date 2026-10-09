import React from 'react';
import { RecurringTiming } from '../../types';

interface RecurringSelectorProps {
  isRecurring: boolean;
  onTypeChange: (isRecurring: boolean) => void;
  frequency: RecurringTiming;
  onFrequencyChange: (timing: RecurringTiming) => void;
}

export const RecurringSelector: React.FC<RecurringSelectorProps> = ({
  isRecurring,
  onTypeChange,
  frequency,
  onFrequencyChange,
}) => {
  const frequencies: { id: RecurringTiming; label: string }[] = [
    { id: 'WEEKLY', label: 'Weekly' },
    { id: 'MONTHLY', label: 'Monthly' },
    { id: 'YEARLY', label: 'Yearly' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-[#57534E]">
        Donation Type
      </label>

      {/* Primary Toggle: One-time vs Recurring */}
      <div className="grid grid-cols-2 gap-2">
        <label
          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
            !isRecurring
              ? 'border-[#0D5C3A] bg-[#0D5C3A]/5 text-[#0D5C3A] font-semibold ring-1 ring-[#0D5C3A]'
              : 'border-[#E7E5E0] bg-white text-[#57534E] hover:border-[#D6D3D1]'
          }`}
        >
          <input
            type="radio"
            name="donationType"
            value="one-time"
            checked={!isRecurring}
            onChange={() => onTypeChange(false)}
            className="h-4 w-4 text-[#0D5C3A] focus:ring-[#0D5C3A]"
          />
          <span className="text-xs font-medium">One-Time Donation</span>
        </label>

        <label
          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
            isRecurring
              ? 'border-[#0D5C3A] bg-[#0D5C3A]/5 text-[#0D5C3A] font-semibold ring-1 ring-[#0D5C3A]'
              : 'border-[#E7E5E0] bg-white text-[#57534E] hover:border-[#D6D3D1]'
          }`}
        >
          <input
            type="radio"
            name="donationType"
            value="recurring"
            checked={isRecurring}
            onChange={() => onTypeChange(true)}
            className="h-4 w-4 text-[#0D5C3A] focus:ring-[#0D5C3A]"
          />
          <span className="text-xs font-medium">Recurring Donation</span>
        </label>
      </div>

      {/* Sub-frequencies when recurring is selected */}
      {isRecurring && (
        <div className="pt-1 space-y-1.5 animate-in fade-in duration-200">
          <span className="text-xs text-[#78716C]">Choose recurrence cadence:</span>
          <div className="grid grid-cols-3 gap-2">
            {frequencies.map((item) => {
              const active = frequency === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFrequencyChange(item.id)}
                  className={`py-2 px-2 text-xs rounded border text-center transition-colors ${
                    active
                      ? 'border-[#0D5C3A] bg-[#0D5C3A]/5 text-[#0D5C3A] font-semibold'
                      : 'border-[#D6D3D1] bg-white text-[#44403C] hover:border-[#A8A29E]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[#78716C] italic pt-1">
            You can modify or pause your recurring pledge at any time from your account settings.
          </p>
        </div>
      )}
    </div>
  );
};
