import React from 'react';
import { Link } from '../router';
import { Heart, ShieldCheck, Users, Eye } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Title & Mission */}
      <div className="space-y-4 border-b border-[#E7E5E0] pb-8">
        <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
          About GiveHope
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-[#1C1917]">
          Small acts. Real impact.
        </h1>
        <p className="text-lg text-[#44403C] leading-relaxed max-w-2xl">
          GiveHope is an open, community-driven donation platform connecting everyday contributors
          with vetted fundraising campaigns across Nepal and South Asia.
        </p>
      </div>

      {/* Main Narrative */}
      <section className="space-y-6 text-[#292524] text-base leading-relaxed">
        <p>
          In times of sudden medical diagnosis or natural calamities, families and remote
          communities are often forced to confront overwhelming financial hurdles alone. Traditional
          aid bureaucracy can take months to respond, while informal social media appeals lack
          verification, reliable accounting, and institutional accountability.
        </p>

        <p>
          GiveHope was established to bridge this specific gap. We provide a structured digital
          home for legitimate fundraising initiatives—whether it is a child undergoing cancer therapy
          at Kanti Children’s Hospital, a remote school in Nuwakot rebuilding earthquake-damaged roofs,
          or communities displaced along the Melamchi riverbed during sudden flash floods.
        </p>

        <p>
          By pairing clear documentation requirements with localized payment integration via Khalti,
          we ensure that donors can contribute with clarity while recipients receive direct,
          verifiable relief.
        </p>
      </section>

      {/* Core Principles */}
      <section className="space-y-8 pt-6">
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Our Operating Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917]">
              <Eye className="w-4 h-4 text-[#0D5C3A]" />
              <span>Documentary Verification</span>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Every campaign must present valid hospital invoices, registered NGO certificates, or
              official ward recommendations before approval.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917]">
              <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
              <span>Regulated Financial Routing</span>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Donations are settled through established payment partners. We do not store sensitive
              banking credentials or hold unmonitored escrow balances.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917]">
              <Users className="w-4 h-4 text-[#0D5C3A]" />
              <span>Donor Privacy & Choice</span>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Contributors maintain complete autonomy over their public identity with anonymous
              options, custom currencies, and flexible recurring cadences.
            </p>
          </div>

          <div className="p-6 bg-white border border-[#E7E5E0] rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1C1917]">
              <Heart className="w-4 h-4 text-[#0D5C3A]" />
              <span>Zero Donor Cuts</span>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Platform operations are sustained through voluntary contributions and institutional
              grants, ensuring net gifts flow directly to verified beneficiaries.
            </p>
          </div>
        </div>
      </section>

      {/* Callout */}
      <div className="p-8 bg-white border border-[#E7E5E0] rounded-xl text-center space-y-4">
        <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Join us in supporting our neighbors.
        </h3>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-md mx-auto">
          Explore vetted fundraisers today or begin a fundraiser for someone in your community.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/campaigns"
            className="px-6 py-2.5 bg-[#0D5C3A] text-white text-xs font-semibold rounded hover:bg-[#0A472C]"
          >
            Explore Campaigns
          </Link>
          <Link
            href="/start-a-campaign"
            className="px-6 py-2.5 bg-white border border-[#D6D3D1] text-[#1C1917] text-xs font-semibold rounded hover:bg-[#FAF9F6]"
          >
            Start a Campaign
          </Link>
        </div>
      </div>
    </div>
  );
};
