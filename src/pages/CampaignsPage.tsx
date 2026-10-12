import React, { useState, useEffect, useMemo } from "react";
import { campaignService } from "../services/campaigns";
import { Campaign, BackendCategory } from "../types";
import { CampaignGrid } from "../components/campaign/CampaignGrid";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BackendCategory | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<
    "NEWEST" | "MOST_FUNDED" | "CLOSEST_TO_GOAL"
  >("NEWEST");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getPublicCampaigns();
        setCampaigns(data);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Filtered & sorted campaigns
  const filteredCampaigns = useMemo(() => {
    let result = campaigns.filter((c) => c.is_active && c.is_approved);

    // Category filter
    if (selectedCategory !== "ALL") {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q)),
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "NEWEST") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortBy === "MOST_FUNDED") {
        return b.current_raised - a.current_raised;
      }
      if (sortBy === "CLOSEST_TO_GOAL") {
        const percentA =
          a.goal_amount > 0 ? a.current_raised / a.goal_amount : 0;
        const percentB =
          b.goal_amount > 0 ? b.current_raised / b.goal_amount : 0;
        return percentB - percentA;
      }
      return 0;
    });

    return result;
  }, [campaigns, selectedCategory, searchQuery, sortBy]);

  const categories: { key: BackendCategory | "ALL"; label: string }[] = [
    { key: "ALL", label: "All Causes" },
    { key: "HEALTH", label: "Health" },
    { key: "EDUCATION", label: "Education" },
    { key: "NATURAL DISASTER", label: "Natural Disaster" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E5E0] pb-8 space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1C1917]">
          Discover campaigns
        </h1>
        <p className="text-sm sm:text-base text-[#57534E] max-w-2xl leading-relaxed">
          Explore vetted fundraisers providing critical medical treatments,
          rebuilding schools, and delivering immediate natural disaster relief.
        </p>
      </div>

      {/* Controls Bar: Search + Category Tabs + Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a cause..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D6D3D1] rounded-md text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
            />
            <Search className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-3.5" />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-[#78716C] flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="text-xs font-medium bg-white border border-[#D6D3D1] rounded-md px-3 py-2 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#0D5C3A]"
            >
              <option value="NEWEST">Newest First</option>
              <option value="MOST_FUNDED">Most Funded</option>
              <option value="CLOSEST_TO_GOAL">Closest to Goal</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-pill, functional buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  active
                    ? "bg-[#0D5C3A] text-white shadow-xs"
                    : "bg-white border border-[#E7E5E0] text-[#57534E] hover:text-[#1C1917] hover:border-[#D6D3D1]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Count Meta */}
      <div className="flex items-center justify-between text-xs text-[#78716C] pt-2">
        <span>
          Showing{" "}
          <span className="font-semibold text-[#1C1917]">
            {filteredCampaigns.length}
          </span>{" "}
          active campaigns
        </span>
      </div>

      {/* Grid */}
      <CampaignGrid
        campaigns={filteredCampaigns}
        isLoading={loading}
        emptyTitle="No campaigns found"
        emptyMessage="Try changing your search keywords or switching category filters."
      />
    </div>
  );
};
