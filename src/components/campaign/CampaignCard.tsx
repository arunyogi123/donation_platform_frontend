import React, { useState } from 'react';
import { Campaign } from '../../types';
import { Link } from '../../router';
import { CampaignProgress } from './CampaignProgress';
import { Heart, Users, MapPin } from 'lucide-react';

import { getMediaUrl } from '../../lib/media';

interface CampaignCardProps {
  campaign: Campaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const [imageError, setImageError] = useState(false);

  const formatCategory = (cat: string) => {
    switch (cat) {
      case 'HEALTH':
        return 'Health';
      case 'EDUCATION':
        return 'Education';
      case 'NATURAL DISASTER':
        return 'Natural Disaster';
      default:
        return cat;
    }
  };

  const imageSrc = getMediaUrl(campaign.image || campaign.image_url);

  return (
    <article className="group bg-white border border-[#E7E5E0] hover:border-[#D6D3D1] rounded-lg overflow-hidden flex flex-col transition-all duration-200 hover:shadow-sm">
      {/* Visual Image Container */}
      <Link href={`/campaigns/${campaign.id}`} className="block relative aspect-4/3 bg-[#F5F4F0] overflow-hidden">
        {!imageError && imageSrc ? (
          <img
            src={imageSrc}
            alt={campaign.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#F2EFE9] text-[#78716C] p-4 text-center">
            <Heart className="w-8 h-8 text-[#A8A29E] mb-2 stroke-1" />
            <span className="text-xs font-serif italic">{campaign.title}</span>
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata Row: Zero-Pill Unboxed Text */}
          <div className="flex items-center justify-between text-xs text-[#78716C]">
            <span className="text-xs uppercase tracking-wider text-[#0D5C3A] font-semibold">
              {formatCategory(campaign.category)}
            </span>
            {campaign.location && (
              <span className="flex items-center gap-1 text-[#78716C]">
                <MapPin className="w-3 h-3 text-[#A8A29E]" />
                <span className="truncate max-w-[120px]">{campaign.location}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-[#1C1917] leading-snug group-hover:text-[#0D5C3A] transition-colors line-clamp-2">
            <Link href={`/campaigns/${campaign.id}`}>{campaign.title}</Link>
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#57534E] line-clamp-2 leading-relaxed">
            {campaign.description}
          </p>
        </div>

        {/* Progress Bar Section */}
        <div className="pt-2 space-y-4 border-t border-[#F5F4F0]">
          <CampaignProgress
            currentRaised={campaign.current_raised}
            goalAmount={campaign.goal_amount}
            currency="NPR"
            size="sm"
          />

          {/* Additional Metadata & Actions */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
              {campaign.donor_count !== undefined && (
                <>
                  <Users className="w-3.5 h-3.5 text-[#A8A29E]" />
                  <span className="tabular-nums">{campaign.donor_count} donors</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/campaigns/${campaign.id}`}
                className="text-xs font-medium text-[#44403C] hover:text-[#1C1917] px-2 py-1 rounded transition-colors"
              >
                View
              </Link>
              <Link
                href={`/campaigns/${campaign.id}/donate`}
                className="text-xs font-semibold px-3 py-1.5 bg-[#0D5C3A] text-white hover:bg-[#0A472C] rounded transition-colors"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
