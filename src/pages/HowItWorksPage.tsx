import React from 'react';
import { Link } from '../router';
import { Search, Heart, Receipt, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest text-[#0D5C3A] font-semibold">
          Simple & Transparent
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C1917]">
          How GiveHope Works
        </h1>
        <p className="text-base text-[#57534E] leading-relaxed">
          From campaign submission to hospital and relief disbursement, here is how our platform
          connects compassionate donors with vetted causes.
        </p>
      </div>

      {/* 3 Main Steps */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white border border-[#E7E5E0] rounded-xl shadow-xs">
          <div className="md:col-span-2">
            <span className="font-serif text-4xl font-bold text-[#0D5C3A]">01</span>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">Find a cause</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Every campaign featured on GiveHope undergoes rigorous prior verification by our
              moderation team. Organizers submit institutional documentation—such as hospital
              oncology protocols, government landslide casualty listings, or registered school
              management committee charters. You can search by cause, location, or urgency level.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#0D5C3A]">
              <CheckCircle className="w-4 h-4" />
              <span>100% staff reviewed before public discovery</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white border border-[#E7E5E0] rounded-xl shadow-xs">
          <div className="md:col-span-2">
            <span className="font-serif text-4xl font-bold text-[#0D5C3A]">02</span>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">Choose how to help</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Tailor your support precisely to what you wish to accomplish. Make an immediate
              one-time gift or establish a weekly, monthly, or yearly recurring contribution in NPR,
              USD, or INR. You can also select the "Make this donation anonymous" option so your name
              is kept strictly confidential from public listings.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#0D5C3A]">
              <CheckCircle className="w-4 h-4" />
              <span>Full control over currency, frequency, and donor privacy</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start p-8 bg-white border border-[#E7E5E0] rounded-xl shadow-xs">
          <div className="md:col-span-2">
            <span className="font-serif text-4xl font-bold text-[#0D5C3A]">03</span>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">Make an impact</h3>
            <p className="text-sm text-[#57534E] leading-relaxed">
              Payments are routed directly through Khalti’s secure gateway. Once completed, your
              donation is permanently recorded against the campaign’s ledger, triggering an official
              downloadable receipt. Track progress milestones in real-time as treatment cycles or
              classroom brickwork proceed.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#0D5C3A]">
              <CheckCircle className="w-4 h-4" />
              <span>Instant verifiable receipts and transparent campaign progression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 bg-[#FAF9F6] border border-[#E7E5E0] rounded-xl text-center space-y-4">
        <h3 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Ready to make a difference?
        </h3>
        <p className="text-xs sm:text-sm text-[#78716C] max-w-lg mx-auto">
          Explore active campaigns across healthcare, educational reconstruction, and natural
          disaster recovery.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            href="/campaigns"
            className="px-6 py-3 bg-[#0D5C3A] text-white text-xs font-semibold rounded hover:bg-[#0A472C] transition-colors"
          >
            Explore Campaigns
          </Link>
          <Link
            href="/start-a-campaign"
            className="px-6 py-3 bg-white border border-[#D6D3D1] text-[#1C1917] text-xs font-semibold rounded hover:bg-[#FAF9F6] transition-colors"
          >
            Start a Fundraiser
          </Link>
        </div>
      </div>
    </div>
  );
};
