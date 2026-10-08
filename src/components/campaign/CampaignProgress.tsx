import React from 'react';

interface CampaignProgressProps {
  currentRaised: number;
  goalAmount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CampaignProgress: React.FC<CampaignProgressProps> = ({
  currentRaised,
  goalAmount,
  currency = 'NPR',
  size = 'md',
}) => {
  const percentage = goalAmount > 0 ? (currentRaised / goalAmount) * 100 : 0;
  const clampedVisualPercentage = Math.min(100, Math.max(0, percentage));
  const isFullyFunded = currentRaised >= goalAmount;

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="space-y-2">
      {/* Progress Bar Track */}
      <div className={`w-full bg-[#E7E5E0] rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className="bg-[#0D5C3A] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedVisualPercentage}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Metrics Row */}
      <div className="flex items-baseline justify-between text-xs sm:text-sm">
        <div>
          <span className="font-semibold text-[#1C1917] tabular-nums">
            {currency} {currentRaised.toLocaleString()}
          </span>{' '}
          <span className="text-[#78716C] font-normal">raised</span>
          <span className="text-[#A8A29E] mx-1">/</span>
          <span className="text-[#78716C]">
            goal {currency} {goalAmount.toLocaleString()}
          </span>
        </div>
        <div className="font-medium text-[#0D5C3A] tabular-nums shrink-0">
          {isFullyFunded ? (
            <span className="font-semibold">100% funded</span>
          ) : (
            <span>{Math.round(percentage)}%</span>
          )}
        </div>
      </div>
    </div>
  );
};
