import React from 'react';
import { Campaign } from '../../types';
import { CampaignCard } from './CampaignCard';

interface CampaignGridProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export const CampaignGrid: React.FC<CampaignGridProps> = ({
  campaigns,
  isLoading = false,
  emptyTitle = 'No campaigns found',
  emptyMessage = 'Try adjusting your search criteria or explore other categories.',
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-[#E7E5E0] rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-4/3 bg-[#E7E5E0]" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-[#E7E5E0] rounded w-1/4" />
              <div className="h-6 bg-[#E7E5E0] rounded w-3/4" />
              <div className="h-4 bg-[#E7E5E0] rounded w-full" />
              <div className="h-2 bg-[#E7E5E0] rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="py-16 px-4 text-center border border-dashed border-[#D6D3D1] rounded-lg bg-white/50 max-w-xl mx-auto">
        <h3 className="font-serif text-lg font-semibold text-[#1C1917]">{emptyTitle}</h3>
        <p className="mt-1 text-sm text-[#78716C]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
};
