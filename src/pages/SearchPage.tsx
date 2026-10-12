import React, { useState, useEffect } from "react";
import { useRouter } from "../router";
import { campaignService } from "../services/campaigns";
import { Campaign } from "../types";
import { CampaignGrid } from "../components/campaign/CampaignGrid";
import { Search } from "lucide-react";

export const SearchPage: React.FC = () => {
  const router = useRouter();
  const initialQuery = router.query.q || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const list = await campaignService.getPublicCampaigns();
        setCampaigns(list);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const matchingCampaigns = campaigns.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header and Search Form */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Search for a cause
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C]">
          Find health fundraisers, school initiatives, and emergency relief
          programs.
        </p>

        <form onSubmit={handleSearchSubmit} className="relative pt-2">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type keywords (e.g. Maya, Nuwakot, Flood, Children)..."
            className="w-full pl-11 pr-24 py-3 bg-white border border-[#D6D3D1] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A] shadow-xs"
          />
          <Search className="w-4 h-4 text-[#A8A29E] absolute left-4 top-5.5" />
          <button
            type="submit"
            className="absolute right-2.5 top-3.5 px-4 py-1.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Header */}
      <div className="border-t border-[#E7E5E0] pt-6 flex items-center justify-between text-xs text-[#78716C]">
        <span>
          {searchTerm ? (
            <>
              Found{" "}
              <strong className="text-[#1C1917]">
                {matchingCampaigns.length}
              </strong>{" "}
              results for "<span className="text-[#0D5C3A]">{searchTerm}</span>"
            </>
          ) : (
            <>Showing all active causes</>
          )}
        </span>
      </div>

      {/* Results Grid */}
      <CampaignGrid
        campaigns={matchingCampaigns}
        isLoading={loading}
        emptyTitle="No causes matched your query"
        emptyMessage="Try broadening your search terms or browsing by category."
      />
    </div>
  );
};
