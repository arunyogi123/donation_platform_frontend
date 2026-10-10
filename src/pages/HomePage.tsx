import React, { useEffect, useState } from 'react';
import { campaignService } from '../services/campaigns';
import { Campaign } from '../types';
import { Link } from '../router';
import { CampaignCard } from '../components/campaign/CampaignCard';
import { CampaignProgress } from '../components/campaign/CampaignProgress';
import { getMediaUrl } from '../lib/media';
import {
  ArrowRight,
  Shield,
  FileCheck,
  CreditCard,
  History,
  Receipt,
  UserCheck,
  RefreshCw,
  Activity,
  GraduationCap,
  AlertCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const list = await campaignService.getPublicCampaigns();
        setFeaturedCampaigns(list.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };
    loadCampaigns();
  }, []);

  const spotlightCampaign = featuredCampaigns[0];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="pt-8 sm:pt-14 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Headline & Intro */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
                  Transparent Community Philanthropy
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#1C1917] leading-[1.12] text-balance">
                  Give where it matters most.
                </h1>
                <p className="text-base sm:text-lg text-[#57534E] leading-relaxed max-w-xl">
                  Support people, communities, and causes that need a helping hand. Every contribution
                  moves a campaign closer to its goal.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/campaigns"
                  className="px-6 py-3.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-sm font-semibold rounded-md transition-colors text-center shadow-xs flex items-center justify-center gap-2"
                >
                  <span>Explore Campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/start-a-campaign"
                  className="px-6 py-3.5 bg-white hover:bg-[#F5F4F0] text-[#1C1917] border border-[#D6D3D1] text-sm font-semibold rounded-md transition-colors text-center"
                >
                  Start a Campaign
                </Link>
              </div>

              {/* Subtle Trust Label */}
              <div className="pt-4 flex items-center gap-4 text-xs text-[#78716C] border-t border-[#E7E5E0]">
                <span>Staff-verified documentation</span>
                <span aria-hidden="true">·</span>
                <span>Direct Khalti settlement</span>
                <span aria-hidden="true">·</span>
                <span>Zero hidden donor fees</span>
              </div>
            </div>

            {/* Right Hero Image Asset */}
            <div className="lg:col-span-6">
              <div className="relative aspect-16/10 sm:aspect-16/11 rounded-lg overflow-hidden border border-[#E7E5E0] shadow-sm bg-[#F5F4F0]">
                <img
                  src="/src/assets/images/hero_humanitarian_1790232023227.jpg"
                  alt="Humanitarian community care and medical solidarity in rural clinic"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IMPACT NUMBERS (Typography-driven per anti-slop rules) */}
      <section className="border-y border-[#E7E5E0] bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] tracking-tight tabular-nums">
                NPR 32M+
              </div>
              <div className="text-xs uppercase tracking-wider text-[#78716C]">Funds Mobilized</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] tracking-tight tabular-nums">
                18K+
              </div>
              <div className="text-xs uppercase tracking-wider text-[#78716C]">Verified Donors</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] tracking-tight tabular-nums">
                1,200+
              </div>
              <div className="text-xs uppercase tracking-wider text-[#78716C]">Approved Campaigns</div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0D5C3A] tracking-tight tabular-nums">
                96%
              </div>
              <div className="text-xs uppercase tracking-wider text-[#78716C]">Campaigns Funded</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CAMPAIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#E7E5E0] gap-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] tracking-tight">
              Causes worth supporting
            </h2>
            <p className="text-sm text-[#78716C] mt-1">Discover campaigns making a difference.</p>
          </div>
          <Link
            href="/campaigns"
            className="text-xs font-semibold text-[#0D5C3A] hover:text-[#0A472C] flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all approved campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-white border border-[#E7E5E0] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featuredCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      {/* 4. EDITORIAL CAMPAIGN STORY (Deep dive feature layout) */}
      {spotlightCampaign && (
        <section className="bg-white border-y border-[#E7E5E0] py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
                    Spotlight Story · Health
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl font-medium text-[#1C1917] leading-tight text-balance">
                    {spotlightCampaign.title}
                  </h3>
                </div>

                <p className="text-sm sm:text-base text-[#44403C] leading-relaxed">
                  {spotlightCampaign.description}
                </p>

                <div className="p-5 bg-[#FAF9F6] border border-[#E7E5E0] rounded-md space-y-4">
                  <CampaignProgress
                    currentRaised={spotlightCampaign.current_raised}
                    goalAmount={spotlightCampaign.goal_amount}
                    currency="NPR"
                    size="md"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#78716C] pt-1">
                    <span>Organizer: {spotlightCampaign.organizer_name}</span>
                    <span>Hospital: Kanti Children’s Hospital, Kathmandu</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link
                    href={`/campaigns/${spotlightCampaign.id}/donate`}
                    className="px-6 py-3 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded transition-colors"
                  >
                    Donate to Maya
                  </Link>
                  <Link
                    href={`/campaigns/${spotlightCampaign.id}`}
                    className="px-5 py-3 border border-[#D6D3D1] text-[#1C1917] hover:bg-[#FAF9F6] text-xs font-medium rounded transition-colors"
                  >
                    Read Detailed Case
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="aspect-4/3 rounded-lg overflow-hidden border border-[#E7E5E0] bg-[#F5F4F0]">
                  <img
                    src={getMediaUrl(spotlightCampaign.image || spotlightCampaign.image_url)}
                    alt={spotlightCampaign.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">
            Targeted Relief
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            Core Categories
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E]">
            Direct your contribution where you feel called to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health */}
          <Link
            href="/categories/HEALTH"
            className="group p-8 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] group-hover:text-[#0D5C3A] transition-colors">
                Health
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Emergency oncology, pediatric heart surgeries, critical trauma care, and lifesaving medical
                procedures for underprivileged families.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-semibold text-[#0D5C3A]">
              <span>Explore health causes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Education */}
          <Link
            href="/categories/EDUCATION"
            className="group p-8 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] group-hover:text-[#0D5C3A] transition-colors">
                Education
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Rebuilding earthquake-damaged classrooms, providing solar power to remote mountain
                schools, and financing scholarships.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-semibold text-[#0D5C3A]">
              <span>Explore education causes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Natural Disaster */}
          <Link
            href="/categories/NATURAL%20DISASTER"
            className="group p-8 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-md bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917] group-hover:text-[#0D5C3A] transition-colors">
                Natural Disaster
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Immediate food rations, water purification kits, and pre-winter shelter materials for
                families displaced by monsoons and landslides.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-[#F5F4F0] flex items-center justify-between text-xs font-semibold text-[#0D5C3A]">
              <span>Explore disaster relief</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-white border-y border-[#E7E5E0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">
              The Journey
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#1C1917]">How It Works</h2>
            <p className="text-sm text-[#57534E]">
              Simple, transparent steps to connect real generosity with urgent human needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="space-y-4 border-l-2 border-[#0D5C3A] pl-6">
              <span className="font-mono text-xs text-[#0D5C3A] font-bold">01</span>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Find a cause</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Discover approved fundraising campaigns with verified medical reports, institutional
                certificates, and transparent goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4 border-l-2 border-[#D6D3D1] pl-6">
              <span className="font-mono text-xs text-[#78716C] font-bold">02</span>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Choose how to help</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Make a one-time donation or set up weekly, monthly, or yearly recurring commitments in
                NPR, USD, or INR. You can also give anonymously.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4 border-l-2 border-[#D6D3D1] pl-6">
              <span className="font-mono text-xs text-[#78716C] font-bold">03</span>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">Make an impact</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Track your contribution and payment history, download official PDF-ready receipts, and
                receive updates directly on campaign milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRANSPARENCY & TRUST SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
              Integrity First
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1C1917] leading-tight">
              Built around transparency.
            </h2>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Every system and policy in GiveHope is designed to protect both the donor and the
              beneficiary through clear, auditable processes.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <FileCheck className="w-4 h-4 text-[#0D5C3A]" />
                <span>Verified Campaigns</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Campaigns require staff validation of medical invoices, NGO registrations, and local
                government clearances before going live.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <CreditCard className="w-4 h-4 text-[#0D5C3A]" />
                <span>Secure Khalti Processing</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Financial transactions are processed directly through Khalti's regulated payment
                gateway with end-to-end tokenization.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <History className="w-4 h-4 text-[#0D5C3A]" />
                <span>Donation History & Tracking</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                View your complete giving record, pending payments, and transaction statuses in a
                unified personal dashboard.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <Receipt className="w-4 h-4 text-[#0D5C3A]" />
                <span>Printable Official Receipts</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Instant generation of verified billing receipts complete with transaction reference
                numbers and date timestamps.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <UserCheck className="w-4 h-4 text-[#0D5C3A]" />
                <span>Anonymous Giving</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Choose to give with complete public privacy while still receiving your verified
                tax-ready receipt privately.
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                <RefreshCw className="w-4 h-4 text-[#0D5C3A]" />
                <span>Predictable Recurring Pledges</span>
              </div>
              <p className="text-xs text-[#57534E] leading-relaxed">
                Sustain long-term cancer care or student tuitions through transparent weekly, monthly,
                or yearly recurring schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-[#FAF9F6] border-t border-[#E7E5E0] pt-12 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#1C1917] tracking-tight">
            Someone's next chapter could start with your help.
          </h2>
          <p className="text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
            Every contribution, large or modest, directly delivers medicine, repairs damaged schools,
            and restores dignity to families in crisis.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/campaigns"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded transition-colors shadow-xs"
            >
              Explore Campaigns
            </Link>
            <Link
              href="/start-a-campaign"
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-[#F5F4F0] text-[#1C1917] border border-[#D6D3D1] text-xs font-semibold rounded transition-colors"
            >
              Start a Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
