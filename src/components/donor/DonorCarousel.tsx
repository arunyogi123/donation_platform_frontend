import React, { useEffect, useState, useRef } from "react";
import { donationService } from "../../services/donations";
import { PublicDonor } from "../../types";
import { getMediaUrl } from "../../lib/media";
import { Link } from "../../router";
import {
  Heart,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ArrowUpDown,
  MoveHorizontal,
  Sparkles,
  Gift,
} from "lucide-react";

interface DonorCarouselProps {
  className?: string;
  title?: string;
  subtitle?: string;
  initialMode?: "horizontal" | "vertical";
  variant?: "hero" | "standalone";
}

export const DonorCarousel: React.FC<DonorCarouselProps> = ({
  className = "",
  title = "Our Generous Benefactors",
  subtitle = "Honoring the community members whose verified contributions directly support emergency healthcare, schools, and disaster recovery.",
  initialMode = "vertical",
  variant = "hero",
}) => {
  const [donors, setDonors] = useState<PublicDonor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [mode, setMode] = useState<"horizontal" | "vertical">(initialMode);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch donors dynamically
  const fetchDonors = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await donationService.getPublicDonors();
      setDonors(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load public donors", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonors();

    // Auto-poll every 12 seconds to pick up new successful donations dynamically
    const pollTimer = setInterval(() => {
      fetchDonors(true);
    }, 12000);

    // Refresh on focus or custom donation completion
    const handleFocus = () => fetchDonors(true);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("donation_success", handleFocus);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("donation_success", handleFocus);
    };
  }, []);

  // Manual scroll controls for horizontal mode
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Helper for donor initials
  const getInitials = (name: string): string => {
    if (!name) return "D";
    const parts = name.replace(/[@_.]/g, " ").trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to format currency
  const formatAmount = (amount: number, currency: string): string => {
    return `${currency} ${Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Vertical card format (compact for hero or vertical ticker)
  const renderVerticalDonorCard = (donor: PublicDonor, idx: number, keyPrefix: string) => {
    const hasPhoto = Boolean(donor.profile_picture);
    const initials = getInitials(donor.full_name || donor.username);

    return (
      <div
        key={`${keyPrefix}-${donor.id}-${idx}`}
        className="w-full bg-[#FAF9F6] border border-[#E7E5E0] hover:border-[#0D5C3A]/50 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all select-none group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            {hasPhoto ? (
              <img
                src={getMediaUrl(donor.profile_picture)}
                alt={donor.username}
                className="w-10 h-10 rounded-full object-cover border border-[#E7E5E0] shadow-2xs group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const fallbackEl = (e.target as HTMLElement).nextElementSibling;
                  if (fallbackEl) fallbackEl.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 rounded-full bg-emerald-50 text-[#0D5C3A] font-serif font-bold text-sm flex items-center justify-center border border-emerald-200 shadow-2xs ${
                hasPhoto ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center ring-1 ring-white">
              <ShieldCheck className="w-2 h-2" />
            </div>
          </div>

          <div className="min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm text-[#1C1917] truncate group-hover:text-[#0D5C3A] transition-colors">
              @{donor.username}
            </h4>
            <p className="text-[11px] text-[#78716C] truncate">
              {donor.full_name && donor.full_name.toLowerCase() !== donor.username.toLowerCase()
                ? donor.full_name
                : "Verified Supporter"}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="block text-[10px] uppercase font-semibold text-[#78716C]">
            Contributed
          </span>
          <span className="font-serif text-sm sm:text-base font-bold text-[#0D5C3A] tabular-nums">
            {formatAmount(donor.total_donated, donor.currency)}
          </span>
        </div>
      </div>
    );
  };

  // Horizontal Card format
  const renderHorizontalDonorCard = (donor: PublicDonor, idx: number, keyPrefix: string) => {
    const hasPhoto = Boolean(donor.profile_picture);
    const initials = getInitials(donor.full_name || donor.username);

    return (
      <div
        key={`${keyPrefix}-${donor.id}-${idx}`}
        className="w-[280px] sm:w-[320px] shrink-0 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A]/50 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group select-none"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="relative">
            {hasPhoto ? (
              <img
                src={getMediaUrl(donor.profile_picture)}
                alt={donor.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const fallbackEl = (e.target as HTMLElement).nextElementSibling;
                  if (fallbackEl) fallbackEl.classList.remove("hidden");
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-emerald-50 text-[#0D5C3A] border border-emerald-200/60 font-serif font-bold text-base flex items-center justify-center shadow-xs group-hover:bg-[#0D5C3A] group-hover:text-white transition-colors ${
                hasPhoto ? "hidden" : "flex"
              }`}
            >
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center ring-2 ring-white">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0D5C3A] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <Heart className="w-2.5 h-2.5 fill-[#0D5C3A]" />
              <span>Verified Donor</span>
            </span>
            <span className="text-[10px] text-[#A8A29E] mt-1 font-mono">
              {donor.donation_count} {donor.donation_count === 1 ? "contribution" : "contributions"}
            </span>
          </div>
        </div>

        <div className="space-y-1 mb-4">
          <h4 className="font-semibold text-sm sm:text-base text-[#1C1917] truncate group-hover:text-[#0D5C3A] transition-colors">
            @{donor.username}
          </h4>
          {donor.full_name && donor.full_name.toLowerCase() !== donor.username.toLowerCase() && (
            <p className="text-xs text-[#78716C] truncate">{donor.full_name}</p>
          )}
        </div>

        <div className="pt-3 border-t border-[#F5F4F0] flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase font-semibold text-[#78716C] tracking-wider">
              Total Contributed
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-[#0D5C3A] tabular-nums">
              {formatAmount(donor.total_donated, donor.currency)}
            </span>
          </div>

          <div className="w-8 h-8 rounded-xl bg-[#FAF9F6] border border-[#E7E5E0] text-[#78716C] flex items-center justify-center group-hover:text-[#0D5C3A] group-hover:border-[#0D5C3A]/30 transition-colors">
            <Gift className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  };

  // HERO SECTION VARIANT: In-place vertical card inside the hero section
  if (variant === "hero") {
    return (
      <div className={`relative bg-white rounded-2xl border border-[#E7E5E0] shadow-sm p-5 sm:p-6 flex flex-col justify-between overflow-hidden group ${className}`}>
        {/* Header */}
        <div className="border-b border-[#F5F4F0] pb-3 mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D5C3A]"></span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#0D5C3A] font-semibold">
                Live Community Philanthropy
              </span>
            </div>

            {/* Play/Pause control */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1 text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF9F6] rounded-md transition-colors"
              title={isPaused ? "Resume Stream" : "Pause Stream"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917] tracking-tight">
            Our Generous Benefactors
          </h3>
          <p className="text-xs text-[#78716C] leading-relaxed">
            Honoring the community members whose verified contributions directly support emergency healthcare, schools, and disaster recovery.
          </p>
        </div>

        {/* Vertical Stream Body */}
        {loading && donors.length === 0 ? (
          <div className="h-[320px] sm:h-[350px] flex flex-col gap-2.5 py-2 animate-pulse justify-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-[#FAF9F6] rounded-xl border border-[#E7E5E0]" />
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="h-[320px] sm:h-[350px] flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Sparkles className="w-8 h-8 text-[#0D5C3A]" />
            <h4 className="font-serif text-base font-semibold text-[#1C1917]">
              Be the Inaugural Benefactor
            </h4>
            <p className="text-xs text-[#78716C] max-w-xs">
              Make a contribution to any active fundraiser to be honored on this live community feed!
            </p>
            <Link
              href="/campaigns"
              className="px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded-md shadow-xs hover:bg-[#0A472C]"
            >
              Explore Campaigns
            </Link>
          </div>
        ) : (
          <div
            className="relative h-[320px] sm:h-[350px] overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Soft gradient edge masks */}
            <div className="absolute left-0 right-0 top-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            <div
              className={`flex flex-col gap-2.5 py-1 ${!isPaused ? "animate-marquee-vertical" : ""}`}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {donors.map((donor, idx) => renderVerticalDonorCard(donor, idx, "hero1"))}
              {donors.map((donor, idx) => renderVerticalDonorCard(donor, idx, "hero2"))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#F5F4F0] flex items-center justify-between text-[11px] text-[#78716C]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>Dual-custody verified settlements</span>
          </span>
          <Link href="/campaigns" className="text-[#0D5C3A] font-semibold hover:underline">
            Join Donors →
          </Link>
        </div>
      </div>
    );
  }

  // STANDALONE VARIANT
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[#E7E5E0] gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0D5C3A]"></span>
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#0D5C3A] font-semibold">
                Live Community Philanthropy
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1C1917] tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          {donors.length > 0 && (
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <div className="flex items-center bg-white border border-[#D6D3D1] rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMode("horizontal")}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    mode === "horizontal"
                      ? "bg-[#0D5C3A] text-white"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                  title="Horizontal Slide"
                >
                  <MoveHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Slide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("vertical")}
                  className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                    mode === "vertical"
                      ? "bg-[#0D5C3A] text-white"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                  title="Vertical Stream"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Stream</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-2 bg-white border border-[#D6D3D1] hover:bg-[#FAF9F6] text-[#57534E] hover:text-[#1C1917] rounded-lg transition-colors shadow-2xs"
                title={isPaused ? "Resume Movement" : "Pause Movement"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              {mode === "horizontal" && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleScroll("left")}
                    className="p-2 bg-white border border-[#D6D3D1] hover:bg-[#FAF9F6] text-[#57534E] hover:text-[#1C1917] rounded-lg transition-colors shadow-2xs cursor-pointer"
                    aria-label="Previous Donors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScroll("right")}
                    className="p-2 bg-white border border-[#D6D3D1] hover:bg-[#FAF9F6] text-[#57534E] hover:text-[#1C1917] rounded-lg transition-colors shadow-2xs cursor-pointer"
                    aria-label="Next Donors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {loading && donors.length === 0 ? (
          <div className="flex gap-4 overflow-hidden py-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[320px] h-48 bg-white border border-[#E7E5E0] rounded-2xl p-5 shrink-0 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E7E5E0]" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-[#E7E5E0] rounded w-2/3" />
                    <div className="h-2.5 bg-[#E7E5E0] rounded w-1/3" />
                  </div>
                </div>
                <div className="h-10 bg-[#FAF9F6] rounded-xl border border-[#E7E5E0]" />
              </div>
            ))}
          </div>
        ) : donors.length === 0 ? (
          <div className="bg-white border border-[#E7E5E0] rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0D5C3A] mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                Be the Inaugural Benefactor
              </h3>
              <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
                No public donations recorded yet. Make a verified contribution to any active
                fundraiser to be honored on this community feed!
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/campaigns"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <span>Support an Urgent Cause</span>
                <Heart className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : mode === "horizontal" ? (
          <div
            className="relative overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollContainerRef}
              className={`flex gap-4 sm:gap-6 py-2 overflow-x-auto scrollbar-none snap-x ${
                !isPaused ? "animate-marquee-horizontal" : ""
              }`}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {donors.map((donor, idx) => renderHorizontalDonorCard(donor, idx, "track1"))}
              {donors.map((donor, idx) => renderHorizontalDonorCard(donor, idx, "track2"))}
            </div>
          </div>
        ) : (
          <div
            className="relative overflow-hidden h-[420px] max-w-2xl mx-auto group bg-white border border-[#E7E5E0] rounded-2xl p-4 sm:p-6 shadow-xs"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="absolute left-0 right-0 top-0 h-10 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />

            <div
              className={`flex flex-col gap-3 py-2 ${
                !isPaused ? "animate-marquee-vertical" : ""
              }`}
              style={{
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {donors.map((donor, idx) => renderVerticalDonorCard(donor, idx, "v1"))}
              {donors.map((donor, idx) => renderVerticalDonorCard(donor, idx, "v2"))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] pt-2 gap-2 border-t border-[#E7E5E0]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
            <span>
              Real-time calculations strictly verified from successful transaction settlements.
            </span>
          </span>
          <span className="text-[11px] text-[#A8A29E] font-mono">
            Auto-synced at {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </section>
  );
};

export default DonorCarousel;
