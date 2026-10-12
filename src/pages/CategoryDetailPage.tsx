import React, { useState, useEffect } from "react";
import { campaignService } from "../services/campaigns";
import { Campaign, BackendCategory } from "../types";
import { Link } from "../router";
import { CampaignGrid } from "../components/campaign/CampaignGrid";
import { ArrowLeft } from "lucide-react";

interface CategoryDetailPageProps {
  categoryKey: string;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categoryKey,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Normalize category key
  const decodedCategory = decodeURIComponent(
    categoryKey,
  ).toUpperCase() as BackendCategory;

  const categoryLabels: Record<string, { title: string; subtitle: string }> = {
    HEALTH: {
      title: "Health Fundraisers",
      subtitle:
        "Support urgent medical operations, pediatric oncology treatments, and critical care hospitalizations.",
    },
    EDUCATION: {
      title: "Education Initiatives",
      subtitle:
        "Invest in school reconstruction, educational supplies, and digital literacy for rural learners.",
    },
    "NATURAL DISASTER": {
      title: "Natural Disaster Relief",
      subtitle:
        "Deliver immediate rescue essentials, clean water supplies, and durable transitional shelters.",
    },
  };

  const currentMeta = categoryLabels[decodedCategory] || {
    title: `${decodedCategory} Causes`,
    subtitle: "Verified community campaigns seeking public solidarity.",
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const all = await campaignService.getPublicCampaigns();
        const filtered = all.filter((c) => c.category === decodedCategory);
        setCampaigns(filtered);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, [decodedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-4">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs text-[#57534E] hover:text-[#1C1917]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all categories
        </Link>
        <div className="border-b border-[#E7E5E0] pb-6 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
            Category
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            {currentMeta.title}
          </h1>
          <p className="text-sm text-[#57534E] max-w-2xl">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      <CampaignGrid
        campaigns={campaigns}
        isLoading={loading}
        emptyTitle={`No active campaigns in ${decodedCategory}`}
        emptyMessage="Check back soon as new verified requests are reviewed by our platform staff."
      />
    </div>
  );
};
