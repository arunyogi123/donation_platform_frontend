import React, { useEffect, useState } from 'react';
import { campaignService } from '../services/campaigns';
import { Campaign } from '../types';
import { Link } from '../router';
import { DonationForm } from '../components/donation/DonationForm';
import { ArrowLeft, Shield } from 'lucide-react';

interface DonatePageProps {
  id: number;
}

export const DonatePage: React.FC<DonatePageProps> = ({ id }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const data = await campaignService.getCampaignById(id);
        setCampaign(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="h-6 bg-[#E7E5E0] rounded w-1/4" />
        <div className="h-96 bg-[#E7E5E0] rounded" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">Campaign Not Found</h2>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5C3A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Browse active campaigns
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Navigation */}
      <div>
        <Link
          href={`/campaigns/${campaign.id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to campaign story
        </Link>
      </div>

      {/* Main Donation Container */}
      <DonationForm campaignId={campaign.id} campaignTitle={campaign.title} />
    </div>
  );
};
