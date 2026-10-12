import React, { useState, useEffect } from "react";
import { useRouter, Link } from "../router";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  LogIn,
  UserCheck,
  Upload,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";
import { CampaignCategory, Currency } from "../types";
import { campaignService } from "../services/campaigns";
import { SEOHead } from "../components/common/SEOHead";
import { useAuth } from "../context/AuthContext";

// Presets
import mayaImg from "../assets/images/campaign_health.jpg";
import classroomImg from "../assets/images/campaign_education.jpg";
import cleanWaterImg from "../assets/images/campaign_elder.jpg";

export const StartCampaignPage: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, login, isLoading: authLoading } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline Quick Login State (when unauthenticated)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CampaignCategory>("Medical");
  const [location, setLocation] = useState("");
  const [organizer, setOrganizer] = useState("");

  const [description, setDescription] = useState("");
  const [fullStory, setFullStory] = useState("");

  // Currency & Goal Amount
  const [currency, setCurrency] = useState<Currency>("NPR");
  const [goalAmount, setGoalAmount] = useState<number>(150000);
  const [deadline, setDeadline] = useState("2026-11-30");

  const currencyOptions: { code: Currency; name: string; symbol: string }[] = [
    { code: "NPR", name: "Nepalese Rupee", symbol: "Rs." },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
  ];

  // Media & Documents
  const [selectedImage, setSelectedImage] = useState<string>(mayaImg);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("medical");

  const availablePresets = [
    { label: "Pediatric & Medical Care", url: mayaImg },
    { label: "Classroom & Literacy", url: classroomImg },
    { label: "Clean Water & Community", url: cleanWaterImg },
  ];

  // Populate organizer name once user is authenticated
  useEffect(() => {
    if (user && !organizer) {
      setOrganizer(user.full_name || user.email || "");
    }
  }, [user, organizer]);

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
    } catch (err: any) {
      setLoginError(
        err.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await login({
        email: "donor@givehope.org",
        password: "Donor@1234",
      });
    } catch (err: any) {
      setLoginError("Demo sign in failed. Please try logging in manually.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomImageFile(file);
      setCustomImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("Please log in before submitting a campaign.");
      return;
    }

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
            "Every contribution to this campaign is held in dual-custody escrow and disbursed directly to the designated facility."),
        image: customImageFile || null,
        image_url: customImagePreview ? undefined : selectedImage,
        document: documentFile || null,
        document_type: documentType,
        organizer_name: organizer.trim() || user?.full_name || user?.email,
        location: location.trim() || "Kathmandu, Nepal",
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      let msg = "Failed to submit campaign. Please check the required fields and try again.";
      if (err.data) {
        if (typeof err.data === "string") msg = err.data;
        else if (err.data.detail) msg = err.data.detail;
        else if (err.data.title)
          msg = Array.isArray(err.data.title) ? err.data.title[0] : String(err.data.title);
        else if (err.data.document)
          msg = Array.isArray(err.data.document) ? err.data.document[0] : String(err.data.document);
        else if (err.data.image)
          msg = Array.isArray(err.data.image) ? err.data.image[0] : String(err.data.image);
      } else if (err.message && err.message !== "NETWORK_UNREACHABLE") {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is not authenticated: Show the clear warning and login prompt
  if (!isAuthenticated && !authLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <SEOHead
          title="Start a Fundraising Campaign — GiveHope"
          description="Sign in to launch a verified fundraising campaign on GiveHope."
          canonicalUrl="https://givehope.org/start-a-campaign"
        />

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Warning Card */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-stone-100 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold uppercase tracking-wider">
                  <span>Authentication Required</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  Please Log In to Start a Campaign
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  You are not logged in. GiveHope requires every fundraiser organizer to be
                  authenticated with a verified account to maintain donor trust, dual-custody escrow,
                  and fraud prevention.
                </p>
              </div>
            </div>

            {/* Quick Warning Notice */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Please log in to make it happen</span>
                <p className="text-stone-600">
                  Once you log in, the 5-step campaign creation application will immediately unlock,
                  and your fundraiser will be linked directly to your organizer profile.
                </p>
              </div>
            </div>

            {/* Inline Quick Login Form */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Quick Sign In</span>
                </h2>
                <Link
                  href="/login?redirect=/start-a-campaign"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Full Login Page →
                </Link>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleInlineLogin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. arun@gmail.com"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:bg-stone-400 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Log In & Continue</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    disabled={isLoggingIn}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-medium rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-stone-600" />
                    <span>1-Click Demo Login</span>
                  </button>
                </div>
              </form>

              <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
                <span>Don't have an account yet?</span>
                <Link
                  href="/register?redirect=/start-a-campaign"
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  Create an Account →
                </Link>
              </div>
            </div>
          </div>

          {/* Campaign Creation Steps Preview Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              What to expect when creating your campaign
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                <span className="font-bold text-stone-900 block">Step 1</span>
                <span className="text-stone-700 font-medium">Basics</span>
                <p className="text-[11px] text-stone-500">Initiative title, category & location</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                <span className="font-bold text-stone-900 block">Step 2</span>
                <span className="text-stone-700 font-medium">Story</span>
                <p className="text-[11px] text-stone-500">Clinical or social cause narrative</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                <span className="font-bold text-stone-900 block">Step 3</span>
                <span className="text-stone-700 font-medium">Target</span>
                <p className="text-[11px] text-stone-500">Fundraising goal & timeline</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                <span className="font-bold text-stone-900 block">Step 4</span>
                <span className="text-stone-700 font-medium">Media</span>
                <p className="text-[11px] text-stone-500">Photographs & case verification</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 space-y-1">
                <span className="font-bold text-stone-900 block">Step 5</span>
                <span className="text-stone-700 font-medium">Review</span>
                <p className="text-[11px] text-stone-500">Compliance & official launch</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State: User is logged in and can create their campaign!
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-stone-50">
      <SEOHead
        title="Start a Fundraising Campaign — GiveHope"
        description="Launch a verified fundraiser for medical care, education, disaster relief, or community rebuilding."
        canonicalUrl="https://givehope.org/create-campaign"
      />

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Organizer Logged-in Header Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>
              Signed in as{" "}
              <strong className="font-semibold text-emerald-900">
                {user?.full_name || user?.email}
              </strong>
            </span>
          </div>
          <Link
            href="/profile"
            className="text-[11px] font-semibold text-emerald-800 hover:underline"
          >
            Organizer Profile →
          </Link>
        </div>

        {/* Campaign Creation Card */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
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
                <h2 className="text-2xl font-bold text-stone-900 font-serif">
                  Campaign Submitted for Review
                </h2>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your campaign has been queued for verification. Our compliance team
                  verifies medical/clinical claims and legal identities within 24 business hours
                  before making the fundraiser public.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/campaigns"
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-[#0D5C3A] hover:bg-[#0A472C] rounded-xl transition-colors"
                  >
                    View All Campaigns
                  </Link>
                  <Link
                    href="/profile"
                    className="px-5 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                  >
                    My Creator Profile
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-semibold block">Submission Error</span>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* STEP 1: BASICS */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Campaign Basics</h2>
                      <p className="text-xs text-stone-500">
                        Provide the key title and focus category for your initiative.
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
                          onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                          className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                        >
                          <option value="Medical">Medical / Healthcare</option>
                          <option value="Education">Education & Schools</option>
                          <option value="Disaster Relief">Disaster Relief</option>
                          <option value="Community">Community Support</option>
                          <option value="Environment">Environment & Ecology</option>
                          <option value="Emergency">Emergency Urgent</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                          Location (City, District / Country)
                        </label>
                        <input
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Kathmandu, Bagmati"
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
                        placeholder="Your full name or registered entity"
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: STORY */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Tell Your Story</h2>
                      <p className="text-xs text-stone-500">
                        Explain who the recipient is, why financial assistance is needed, and how
                        funds will be used.
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
                        placeholder="Provide honest background, clinical situation, treatment schedule, hospital estimate, or reconstruction plan..."
                        className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: GOAL & TIMELINE */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Fundraising Target</h2>
                      <p className="text-xs text-stone-500">
                        Choose your campaign currency and define the capital needed and projected timeline.
                      </p>
                    </div>

                    {/* Currency Selector (Dollar, Nepalese Rupee, Indian Rupee) */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                        Select Currency
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {currencyOptions.map((curr) => {
                          const isSelected = currency === curr.code;
                          return (
                            <button
                              key={curr.code}
                              type="button"
                              onClick={() => {
                                setCurrency(curr.code);
                                if (curr.code === "USD" && goalAmount > 50000) {
                                  setGoalAmount(5000);
                                } else if ((curr.code === "NPR" || curr.code === "INR") && goalAmount < 1000) {
                                  setGoalAmount(150000);
                                }
                              }}
                              className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                                isSelected
                                  ? "border-emerald-700 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-700/20 font-semibold"
                                  : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700"
                              }`}
                            >
                              <div className="font-mono text-sm font-bold flex items-center justify-center gap-1">
                                <span>{curr.symbol}</span>
                                <span>{curr.code}</span>
                              </div>
                              <div className="text-[11px] text-stone-500 mt-0.5 truncate">
                                {curr.name}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target Amount */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Target Amount ({currency === "NPR" ? "Nepalese Rupee — NPR" : currency === "USD" ? "US Dollar — USD" : "Indian Rupee — INR"})
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono font-bold text-stone-500 text-sm select-none pointer-events-none">
                          {currency === "USD" ? "$" : currency === "INR" ? "₹" : "Rs."}
                        </div>
                        <input
                          type="number"
                          min={currency === "USD" ? "10" : "500"}
                          step={currency === "USD" ? "50" : "100"}
                          required
                          value={goalAmount}
                          onChange={(e) => setGoalAmount(parseFloat(e.target.value) || 0)}
                          className="w-full pl-12 pr-16 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-emerald-600"
                        />
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400 font-mono pointer-events-none uppercase">
                          {currency}
                        </div>
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
                        Dual-Custody Disbursement
                      </span>
                      <p className="text-stone-500">
                        GiveHope holds funds in dual-custody escrow. Disbursements are issued to
                        designated service providers and hospitals with verifiable receipts.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: MEDIA & SUPPORTING DOCUMENTS */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">
                        Photography & Verification Documents
                      </h2>
                      <p className="text-xs text-stone-500">
                        Authentic cover images and supporting documentation speed up approval.
                      </p>
                    </div>

                    {/* Presets or Custom Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                        Select Preset Cover Image
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {availablePresets.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedImage(p.url);
                              setCustomImageFile(null);
                              setCustomImagePreview(null);
                            }}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                              selectedImage === p.url && !customImagePreview
                                ? "border-emerald-700 ring-2 ring-emerald-700/20"
                                : "border-stone-200 hover:border-stone-300"
                            }`}
                          >
                            <img src={p.url} alt="" className="aspect-[4/3] w-full object-cover" />
                            <p className="p-2 text-[11px] font-medium text-stone-700 text-center truncate">
                              {p.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Cover Photo Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                        Or Upload Custom Campaign Photo
                      </label>
                      <label className="border-2 border-dashed border-stone-200 hover:border-emerald-600 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-stone-50">
                        <Upload className="w-5 h-5 text-stone-400 mb-1" />
                        <span className="text-xs font-semibold text-stone-700">
                          {customImageFile ? customImageFile.name : "Choose custom image file"}
                        </span>
                        <span className="text-[11px] text-stone-400">JPG, PNG, or WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Supporting Document Upload */}
                    <div className="pt-2 border-t border-stone-100 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                          Campaign Supporting Document (Medical bill, quote, or ID)
                        </label>
                        <p className="text-[11px] text-stone-500 mb-2">
                          Optional for verified organizers/admins, recommended for fast approval.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Document Type
                          </label>
                          <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                          >
                            <option value="medical">Medical Report / Hospital Estimate</option>
                            <option value="id">Citizenship / Identity Proof</option>
                            <option value="ngo">Ward Recommendation / NGO Reg</option>
                            <option value="other">Other Official Document</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                            Attach File (PDF, JPG, PNG)
                          </label>
                          <input
                            type="file"
                            accept=".pdf,image/jpeg,image/png,image/webp"
                            onChange={handleDocumentFileChange}
                            className="w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: PREVIEW & SUBMISSION */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">Review Before Publication</h2>
                      <p className="text-xs text-stone-500">
                        Please confirm that all details are accurate before submitting to compliance.
                      </p>
                    </div>

                    <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                      <div>
                        <span className="text-stone-400 block font-semibold uppercase">Title</span>
                        <span className="font-bold text-stone-900 text-sm">
                          {title || "Untitled Campaign"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-stone-400 block font-semibold uppercase">
                            Category
                          </span>
                          <span className="font-semibold text-emerald-800">{category}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block font-semibold uppercase">
                            Goal Target
                          </span>
                          <span className="font-bold text-stone-900 font-mono text-sm">
                            {currency === "USD" ? "$" : currency === "INR" ? "₹" : "Rs."}
                            {goalAmount.toLocaleString()} {currency}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-stone-400 block font-semibold uppercase">
                          Location & Organizer
                        </span>
                        <span className="text-stone-700">
                          {location || "Kathmandu, Nepal"} · Organized by {organizer}
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

                      {documentFile && (
                        <div>
                          <span className="text-stone-400 block font-semibold uppercase">
                            Attached Supporting Document
                          </span>
                          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{documentFile.name}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div className="text-xs text-emerald-950">
                        <strong className="font-semibold block">
                          Compliance Screening Agreement
                        </strong>
                        You affirm that all details are truthful and agree to supply clinical or
                        legal documentation upon coordinator request.
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
                      href="/"
                      className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </Link>
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={() => setStep((prev) => (prev + 1) as any)}
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting for review...</span>
                        </>
                      ) : (
                        <span>Submit Campaign for Review</span>
                      )}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCampaignPage;
