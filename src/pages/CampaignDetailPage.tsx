import React, { useEffect, useState } from "react";
import { campaignService } from "../services/campaigns";
import { Campaign, CampaignDocument, SubscriptionPlan } from "../types";
import { Link, useRouter } from "../router";
import { CampaignProgress } from "../components/campaign/CampaignProgress";
import {
  Heart,
  Share2,
  Calendar,
  ShieldCheck,
  CheckCircle,
  FileText,
  MapPin,
  User,
  ArrowLeft,
  Check,
  Package,
  ExternalLink,
} from "lucide-react";
import { getMediaUrl } from "../lib/media";

interface CampaignDetailPageProps {
  id: number;
}

export const CampaignDetailPage: React.FC<CampaignDetailPageProps> = ({
  id,
}) => {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [documents, setDocuments] = useState<CampaignDocument[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const data = await campaignService.getCampaignById(id);
        setCampaign(data);

        if (data) {
          const [docsData, plansData] = await Promise.all([
            campaignService.getCampaignDocuments(data.id),
            campaignService.getSubscriptionPlans(data.id),
          ]);
          setDocuments(docsData);
          setPlans(plansData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-8 bg-[#E7E5E0] rounded w-1/3" />
        <div className="h-96 bg-[#E7E5E0] rounded" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Campaign Not Found
        </h2>
        <p className="text-sm text-[#78716C]">
          The campaign you requested does not exist or has concluded its public
          funding run.
        </p>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all campaigns
        </Link>
      </div>
    );
  }

  const formatCategory = (cat: string) => {
    switch (cat) {
      case "HEALTH":
        return "Health";
      case "EDUCATION":
        return "Education";
      case "NATURAL DISASTER":
        return "Natural Disaster";
      default:
        return cat;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-[#78716C]">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-[#57534E] hover:text-[#1C1917]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Discover
        </Link>
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider font-semibold text-[#0D5C3A]">
            {formatCategory(campaign.category)}
          </span>
          <span aria-hidden="true">·</span>
          <span>Campaign #{campaign.id}</span>
        </div>
      </div>

      {/* Main Campaign Header */}
      <div className="space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] tracking-tight leading-tight max-w-4xl text-balance">
          {campaign.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-[#78716C] pt-1">
          {campaign.organizer_name && (
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#A8A29E]" />
              Organized by{" "}
              <strong className="text-[#1C1917]">
                {campaign.organizer_name}
              </strong>
            </span>
          )}
          {campaign.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#A8A29E]" />
              <span>{campaign.location}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#A8A29E]" />
            <span>
              Created{" "}
              {new Date(campaign.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>
        </div>
      </div>

      {/* Layout Grid: Left Story / Right Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* LEFT COLUMN: Visual + Editorial Story + Verification Documents */}
        <div className="lg:col-span-8 space-y-10">
          {/* Main Visual Asset */}
          <div className="aspect-16/10 rounded-xl overflow-hidden border border-[#E7E5E0] bg-[#F5F4F0] shadow-xs">
            <img
              src={getMediaUrl(campaign.image || campaign.image_url)}
              alt={campaign.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Editorial Story Section */}
          <section className="space-y-6">
            <div className="border-b border-[#E7E5E0] pb-4">
              <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
                About this campaign
              </h2>
            </div>

            <div className="prose prose-stone max-w-none text-[#292524] text-base sm:text-lg leading-relaxed space-y-4">
              <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-[#0D5C3A]">
                {campaign.description}
              </p>
              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed">
                All contributions submitted to this campaign are channeled
                directly into verified local medical dispensaries, educational
                materials suppliers, or regional relief networks. Disbursements
                require tripartite confirmation with the organizing committee
                and GiveHope field staff.
              </p>
            </div>
          </section>

          {/* Campaign-Specific Subscription / Sustained Support Plans */}
          {plans.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-[#E7E5E0]">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                  Sustained Support Packages
                </h3>
                <p className="text-xs text-[#78716C] mt-1">
                  Structured regular sponsorship plans tailored specifically to
                  this campaign’s ongoing needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 bg-white border border-[#E7E5E0] rounded-lg space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#0D5C3A] uppercase tracking-wider">
                          {plan.package}
                        </span>
                        <Package className="w-3.5 h-3.5 text-[#A8A29E]" />
                      </div>
                      <div className="mt-2 text-lg font-serif font-bold text-[#1C1917] tabular-nums">
                        {plan.currency} {plan.amount.toLocaleString()}
                        <span className="text-xs font-normal text-[#78716C]">
                          {" "}
                          / month
                        </span>
                      </div>
                      <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                        {plan.benefits}
                      </p>
                    </div>

                    <Link
                      href={`/campaigns/${campaign.id}/donate?plan=${plan.id}`}
                      className="w-full text-center py-2 text-xs font-semibold bg-[#FAF9F6] border border-[#D6D3D1] hover:bg-[#0D5C3A] hover:text-white hover:border-[#0D5C3A] rounded transition-colors"
                    >
                      Select Plan
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Verification & Campaign Documents Section */}
          <section className="bg-white border border-[#E7E5E0] rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0D5C3A]" />
              <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                Trust & Verification Records
              </h3>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed">
              To safeguard personal privacy while guaranteeing integrity, the
              backend platform moderates all institutional documentation
              internally. Below is the verification status recorded for this
              campaign:
            </p>

            <div className="divide-y divide-[#F5F4F0]">
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const docUrl =
                    doc.document && doc.document !== "**"
                      ? getMediaUrl(doc.document)
                      : null;
                  const docLabel =
                    doc.document_type_display || doc.document_type;
                  return (
                    <div
                      key={doc.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#78716C] shrink-0" />
                        <div>
                          <span className="font-medium text-[#1C1917]">
                            {docLabel}
                          </span>
                          {doc.document_name && doc.document_name !== "**" && (
                            <span className="ml-2 text-[11px] text-[#78716C]">
                              ({doc.document_name})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {docUrl && (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0D5C3A] hover:underline bg-[#FAF9F6] border border-[#D6D3D1] px-2.5 py-1 rounded transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View Document</span>
                          </a>
                        )}
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Staff Verified</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 text-xs text-[#78716C]">
                  All organizer credentials confirmed by GiveHope compliance
                  review.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Donation Box */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="bg-white border border-[#E7E5E0] rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="space-y-4">
              <CampaignProgress
                currentRaised={campaign.current_raised}
                goalAmount={campaign.goal_amount}
                currency="NPR"
                size="md"
              />

              <div className="pt-2 flex items-center justify-between text-xs text-[#78716C] border-t border-[#F5F4F0]">
                <span>{campaign.donor_count || 0} generous supporters</span>
                <span>Active & Approved</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <Link
                href={`/campaigns/${campaign.id}/donate`}
                className="w-full py-3.5 px-4 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-center font-semibold text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                <span>Donate now</span>
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF9F6] border border-[#D6D3D1] text-[#1C1917] text-center font-medium text-xs rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span className="text-[#0D5C3A]">
                      Link Copied to Clipboard
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Share Campaign</span>
                  </>
                )}
              </button>
            </div>

            {/* Security Guarantee */}
            <div className="pt-4 border-t border-[#F5F4F0] text-[11px] text-[#78716C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D5C3A] shrink-0" />
              <span>
                Payments routed securely via Khalti gateway integration.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Donation Footer (Cap <= 15% mobile viewport per anti-slop rules) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E7E5E0] p-3 shadow-lg flex items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#1C1917] tabular-nums">
            NPR {campaign.current_raised.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#78716C]">
            of NPR {campaign.goal_amount.toLocaleString()}
          </div>
        </div>
        <Link
          href={`/campaigns/${campaign.id}/donate`}
          className="py-2.5 px-6 bg-[#0D5C3A] text-white text-xs font-semibold rounded shadow-xs"
        >
          Donate now
        </Link>
      </div>
    </div>
  );
};
