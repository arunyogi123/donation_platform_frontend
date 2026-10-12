import React, { useState } from "react";
import { useRouter, Link } from "../router";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { CampaignCategory } from "../types";
import { campaignService } from "../services/campaigns";
import { SEOHead } from "../components/common/SEOHead";

// Use your image filenames here:
import mayaImg from "../assets/images/campaign_health.jpg";
import classroomImg from "../assets/images/campaign_education.jpg";
import cleanWaterImg from "../assets/images/campaign_elder.jpg";

export const StartCampaignPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CampaignCategory>("Medical");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("Arun Yogi");

  const [description, setDescription] = useState("");
  const [fullStory, setFullStory] = useState("");

  const [goalAmount, setGoalAmount] = useState<number>(15000);
  const [deadline, setDeadline] = useState("2026-11-30");

  const [selectedImage, setSelectedImage] = useState<string>(mayaImg);

  const availablePresets = [
    { label: "Pediatric & Medical Care", url: mayaImg },
    { label: "Classroom & Literacy", url: classroomImg },
    { label: "Clean Water & Community", url: cleanWaterImg },
  ];

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const backendCategoryMap: Record<
        string,
        "HEALTH" | "EDUCATION" | "NATURAL DISASTER"
      > = {
        Medical: "HEALTH",
        HEALTH: "HEALTH",
        Education: "EDUCATION",
        EDUCATION: "EDUCATION",
        "Disaster Relief": "NATURAL DISASTER",
        "NATURAL DISASTER": "NATURAL DISASTER",
        Emergency: "NATURAL DISASTER",
        Community: "HEALTH",
        Environment: "NATURAL DISASTER",
      };
      const cat = backendCategoryMap[category] || "HEALTH";

      await campaignService.createCampaign({
        title: title.trim() || "Community Medical Assistance Fund",
        category: cat,
        goal_amount: goalAmount || 10000,
        description:
          (description.trim() ? description.trim() + "\n\n" : "") +
          (fullStory.trim() ||
            "Every contribution to this campaign is held in dual-custody escrow and disbursed directly to the designated healthcare facility."),
        image_url: selectedImage,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <SEOHead
        title="Start a Fundraising Campaign — GiveHope"
        description="Launch a verified fundraiser for medical care, education, disaster relief, or community rebuilding."
        canonicalUrl="https://givehope.org/create-campaign"
      />

      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Step Indicator Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold uppercase tracking-wider mb-3">
            <span>Campaign Application</span>
            <span>Step {step} of 5</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-700 h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                Campaign Submitted for Review
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you! Your campaign has been queued for verification. Our
                compliance team verifies medical/clinical claims and legal
                identities within 24 business hours before making the fundraiser
                public.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/admin"
                  className="px-5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
                >
                  View in Admin Approvals Queue
                </Link>
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Campaign Basics
                    </h2>
                    <p className="text-xs text-stone-500">
                      Provide the key title and focus category for your
                      initiative.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Urgent Pediatric Cardiac Care for Maya"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) =>
                          setCategory(e.target.value as CampaignCategory)
                        }
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                      >
                        <option value="Medical">Medical</option>
                        <option value="Education">Education</option>
                        <option value="Disaster Relief">Disaster Relief</option>
                        <option value="Community">Community</option>
                        <option value="Environment">Environment</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Location (City, State / Region)
                      </label>
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Denver, Colorado"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Organizer Name or Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: STORY */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Tell Your Story
                    </h2>
                    <p className="text-xs text-stone-500">
                      Explain who the recipient is, why financial assistance is
                      needed, and how funds will be used.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Short Summary (2-3 sentences)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief overview displayed on campaign cards..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Complete Campaign Story & Details
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={fullStory}
                      onChange={(e) => setFullStory(e.target.value)}
                      placeholder="Provide honest background, medical situation, treatment schedule, or project timeline..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: GOAL & TIMELINE */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Fundraising Target
                    </h2>
                    <p className="text-xs text-stone-500">
                      Define the exact capital needed and your projected
                      timeline.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Target Amount (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        min="500"
                        step="100"
                        required
                        value={goalAmount}
                        onChange={(e) =>
                          setGoalAmount(parseFloat(e.target.value) || 0)
                        }
                        className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Target Deadline Date
                    </label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <span className="font-semibold text-stone-800">
                      Disbursement Guarantee
                    </span>
                    <p className="text-stone-500">
                      GiveHope releases funds as they arrive; you do not have to
                      reach 100% of your goal before utilizing verified
                      donations.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: IMAGE */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Campaign Photography
                    </h2>
                    <p className="text-xs text-stone-500">
                      Authentic, respectful documentary photographs increase
                      donor connection by over 300%.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                      Select Primary Photograph
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {availablePresets.map((p, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImage(p.url)}
                          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            selectedImage === p.url
                              ? "border-emerald-700 ring-2 ring-emerald-700/20"
                              : "border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <img
                            src={p.url}
                            alt=""
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <p className="p-2 text-[11px] font-medium text-stone-700 text-center truncate">
                            {p.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs text-stone-500 block mb-1">
                      Selected Cover Image:
                    </span>
                    <div className="aspect-[16/9] rounded-xl overflow-hidden border border-stone-200">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PREVIEW & SUBMISSION */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">
                      Review Before Publication
                    </h2>
                    <p className="text-xs text-stone-500">
                      Please confirm that all details are accurate before
                      submitting to compliance.
                    </p>
                  </div>

                  <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                    <div>
                      <span className="text-stone-400 block font-semibold uppercase">
                        Title
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {title || "Untitled Campaign"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 block font-semibold uppercase">
                          Category
                        </span>
                        <span className="font-semibold text-emerald-800">
                          {category}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 block font-semibold uppercase">
                          Goal Target
                        </span>
                        <span className="font-bold text-stone-900 font-mono text-sm">
                          ${goalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-stone-400 block font-semibold uppercase">
                        Location & Organizer
                      </span>
                      <span className="text-stone-700">
                        {location || "Denver, CO"} · Organized by {organizer}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block font-semibold uppercase">
                        Summary
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="text-xs text-emerald-950">
                      <strong className="font-semibold block">
                        Compliance Screening Agreement
                      </strong>
                      You affirm that all details are truthful and agree to
                      supply clinical or legal documentation upon coordinator
                      request.
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Controls */}
              <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as any)}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous Step</span>
                  </button>
                ) : (
                  <Link
                    to="/"
                    className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </Link>
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev + 1) as any)}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl inline-flex items-center gap-1.5"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl inline-flex items-center gap-2"
                  >
                    {isSubmitting
                      ? "Submitting for review..."
                      : "Submit Campaign for Review"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartCampaignPage;
