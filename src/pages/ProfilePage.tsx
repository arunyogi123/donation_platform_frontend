import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { accountService } from "../services/account";
import { UserProfile, CreatorDocument } from "../types";
import { Link, useRouter } from "../router";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  RefreshCw,
  PlusCircle,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Upload,
  Trash2,
  FileText,
  Camera,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Check,
  X,
  FileCheck,
} from "lucide-react";
import { GiveHopeLogo } from "../components/brand/GiveHopeLogo";

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, logout, login } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"creator" | "overview">("creator");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<CreatorDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Form edit states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null,
  );

  // Document upload state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("id");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Status feedback
  const [highlightField, setHighlightField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const data = await accountService.getProfile();
      setProfile(data);
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
      setBio(data.bio || "");
      if (data.profile_picture_url || data.profile_picture) {
        setProfileImagePreview(
          data.profile_picture_url || (data.profile_picture as string),
        );
      }
      setDocuments(data.documents || []);
    } catch (err: any) {
      setErrorMessage("Could not load profile details. Please refresh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProfileData();
    }
  }, [isAuthenticated]);

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setHighlightField(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setErrorMessage(
          "Profile picture must be a JPG, PNG, or WebP image file.",
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Profile picture file size cannot exceed 5MB.");
        return;
      }
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);
    setHighlightField(null);

    // Explicit field validation
    if (
      !profileImagePreview &&
      !profileImageFile &&
      !profile?.profile_picture
    ) {
      setHighlightField("picture");
      setErrorMessage("Please upload a profile picture.");
      return;
    }

    if (!fullName.trim()) {
      setHighlightField("name");
      setErrorMessage("Please enter your full legal name.");
      return;
    }

    if (!phone.trim()) {
      setHighlightField("phone");
      setErrorMessage("Please enter your contact phone number.");
      return;
    }

    if (!address.trim()) {
      setHighlightField("address");
      setErrorMessage("Please enter your address or district.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("full_name", fullName.trim());
      formData.append("phone", phone.trim());
      formData.append("address", address.trim());
      formData.append("bio", bio.trim());
      if (profileImageFile) {
        formData.append("profile_picture", profileImageFile);
      }

      const updated = await accountService.updateProfile(formData);
      setProfile(updated);
      if (documents.length === 0) {
        setSuccessMessage(
          "Profile details saved! Please upload at least one official verification document to become an approved creator.",
        );
      } else {
        setSuccessMessage("Creator profile details updated successfully.");
      }
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      let msg =
        "Failed to update profile. Please check the fields and try again.";
      if (err.data) {
        if (typeof err.data === "string") msg = err.data;
        else if (err.data.detail) msg = err.data.detail;
        else if (err.data.phone)
          msg = Array.isArray(err.data.phone)
            ? err.data.phone[0]
            : String(err.data.phone);
      } else if (err.message && err.message !== "NETWORK_UNREACHABLE") {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setHighlightField(null);
    if (!docFile) {
      setHighlightField("doc");
      setErrorMessage(
        "Please upload at least one official verification document.",
      );
      return;
    }

    setErrorMessage(null);
    setIsUploadingDoc(true);

    try {
      await accountService.uploadCreatorDocument(docFile, docType);
      setDocFile(null);
      if (docFileInputRef.current) {
        docFileInputRef.current.value = "";
      }
      setSuccessMessage("Document uploaded successfully.");
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadProfileData();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload verification document.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this verification document?",
      )
    )
      return;
    try {
      await accountService.deleteCreatorDocument(id);
      setSuccessMessage("Document removed.");
      setTimeout(() => setSuccessMessage(null), 3000);
      await loadProfileData();
    } catch (err: any) {
      setErrorMessage("Failed to delete document.");
    }
  };

  const handleDemoSignIn = async () => {
    await login({ email: "donor@givehope.org", password: "Donor@1234" });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <Link href="/" className="inline-flex justify-center hover:opacity-90">
          <GiveHopeLogo size="lg" />
        </Link>
        <div className="w-12 h-12 rounded-full bg-[#0D5C3A]/10 text-[#0D5C3A] mx-auto flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
          Sign in to view Profile
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
          Please log in to manage your creator profile, verification documents,
          and donation history.
        </p>
        <div className="flex flex-col gap-2.5 pt-2">
          <Link
            href="/login"
            className="w-full py-2.5 bg-[#0D5C3A] text-white text-xs font-semibold rounded hover:bg-[#0A472C]"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 bg-white border border-[#D6D3D1] text-[#1C1917] text-xs font-medium rounded hover:bg-[#FAF9F6]"
          >
            Sign in as Demo User
          </button>
        </div>
      </div>
    );
  }

  // Calculate live validation status
  const hasFullName = Boolean(fullName && fullName.trim());
  const hasPhone = Boolean(phone && phone.trim());
  const hasAddress = Boolean(address && address.trim());
  const hasPhoto = Boolean(profileImagePreview || profile?.profile_picture);
  const hasDocuments = documents.length > 0;

  const checklist = [
    { id: "picture", label: "Profile Picture", done: hasPhoto },
    { id: "name", label: "Full Legal Name", done: hasFullName },
    { id: "phone", label: "Contact Phone Number", done: hasPhone },
    { id: "address", label: "Address / District", done: hasAddress },
    { id: "doc", label: "Verification Document", done: hasDocuments },
  ];
  const missingItems = checklist.filter((i) => !i.done);
  const isSingleMissing = missingItems.length === 1;
  const isReady = missingItems.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E5E0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <GiveHopeLogo size="sm" iconOnly />
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Creator & User Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#78716C] mt-0.5">
              Manage your identity verification, creator documents, and giving
              activity.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7E5E0] gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("creator")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "creator"
              ? "text-[#0D5C3A] border-b-2 border-[#0D5C3A]"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          Creator Profile & Documents
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative cursor-pointer ${
            activeTab === "overview"
              ? "text-[#0D5C3A] border-b-2 border-[#0D5C3A]"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          Giving Dashboard & Records
        </button>
      </div>

      {/* Global Alerts */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-md flex items-center gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {activeTab === "creator" && (
        <div className="space-y-8">
          {/* Creator Readiness Status Card */}
          <div
            className={`p-6 rounded-xl border ${
              isReady
                ? "bg-emerald-50/60 border-emerald-200"
                : "bg-amber-50/60 border-amber-200"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Creator Profile Complete
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      {isSingleMissing
                        ? `⚠️ ${missingItems[0].label} Required`
                        : `Action Required: ${missingItems.length} Requirements Missing`}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  {isReady
                    ? "You are authorized to start a donation campaign"
                    : isSingleMissing
                      ? missingItems[0].id === "doc"
                        ? "Please upload at least one official verification document before creating a campaign."
                        : `Please complete your ${missingItems[0].label.toLowerCase()} before creating a campaign.`
                      : "Please complete these requirements before creating a campaign."}
                </h3>
                <p className="text-xs text-[#57534E]">
                  {isReady
                    ? "All required identity and contact credentials have been completed. You can create your campaign anytime."
                    : "To protect donors from fraud, GiveHope requires every campaign organizer to verify their identity, phone, address, and verification document."}
                </p>
              </div>

              {isReady ? (
                <Link
                  href="/start-a-campaign"
                  className="px-5 py-2.5 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Start a Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <a
                  href={
                    missingItems[0]?.id === "doc"
                      ? "#documents-section"
                      : "#profile-form"
                  }
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-md shadow-xs flex items-center justify-center shrink-0"
                >
                  Complete Requirements
                </a>
              )}
            </div>

            {/* Checklist */}
            <div className="mt-5 pt-4 border-t border-black/5 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5">
                  {item.done ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span
                    className={
                      item.done ? "text-[#1C1917]" : "text-red-700 font-medium"
                    }
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: Basic Information & Profile Picture */}
          <div
            id="profile-form"
            className="bg-white border border-[#E7E5E0] rounded-xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="border-b border-[#F5F4F0] pb-4">
              <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                Creator Profile Details
              </h2>
              <p className="text-xs text-[#78716C] mt-0.5">
                Your legal identity and public representation on GiveHope
                campaigns.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative group">
                  <div
                    className={`w-20 h-20 rounded-full border-2 overflow-hidden bg-[#FAF9F6] flex items-center justify-center transition-all ${
                      highlightField === "picture"
                        ? "border-red-500 ring-4 ring-red-200"
                        : "border-[#D6D3D1]"
                    }`}
                  >
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#A8A29E]" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-[#0D5C3A] text-white rounded-full hover:bg-[#0A472C] transition-colors shadow-xs"
                    title="Upload profile picture"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#1C1917]">
                    Profile Picture *
                  </label>
                  <p className="text-xs text-[#78716C]">
                    Upload a recognizable portrait photograph (JPG, PNG, WebP up
                    to 5MB).
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleProfileImageSelect}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-medium text-[#0D5C3A] hover:underline"
                    >
                      {profileImagePreview
                        ? "Change photo"
                        : "Select image file"}
                    </button>
                    {profileImagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImageFile(null);
                          setProfileImagePreview(null);
                        }}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (highlightField === "name") setHighlightField(null);
                    }}
                    placeholder="e.g. Maya Kumari Shrestha"
                    className={`w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] transition-all ${
                      highlightField === "name"
                        ? "border-red-500 ring-2 ring-red-200 bg-red-50/20"
                        : "border-[#D6D3D1]"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (highlightField === "phone") setHighlightField(null);
                    }}
                    placeholder="e.g. +977-9801234567"
                    className={`w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] transition-all ${
                      highlightField === "phone"
                        ? "border-red-500 ring-2 ring-red-200 bg-red-50/20"
                        : "border-[#D6D3D1]"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile?.email || user?.email || ""}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-[#FAF9F6] border border-[#E7E5E0] text-[#78716C] rounded-md"
                  />
                  <p className="text-[11px] text-[#A8A29E] mt-0.5">
                    Account email linked to login.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Address / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (highlightField === "address") setHighlightField(null);
                    }}
                    placeholder="e.g. Lalitpur, Bagmati, Nepal"
                    className={`w-full text-xs sm:text-sm px-3.5 py-2.5 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] transition-all ${
                      highlightField === "address"
                        ? "border-red-500 ring-2 ring-red-200 bg-red-50/20"
                        : "border-[#D6D3D1]"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Creator Bio / Organization Summary (Optional)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a brief overview of who you are, your community initiatives, or organizational background..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:bg-[#A8A29E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Creator Required Documents */}
          <div
            id="documents-section"
            className="bg-white border border-[#E7E5E0] rounded-xl p-6 sm:p-8 shadow-xs space-y-6"
          >
            <div className="border-b border-[#F5F4F0] pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#1C1917]">
                    Required Verification Documents *
                  </h2>
                  <p className="text-xs text-[#78716C] mt-0.5">
                    Official documents proving organizer identity or
                    registration (Citizenship, Passport, NGO Cert, Ward Letter).
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    documents.length > 0
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {documents.length > 0
                    ? `${documents.length} Uploaded`
                    : "0 Uploaded (Required)"}
                </span>
              </div>
            </div>

            {/* Document Upload Sub-form */}
            <form
              onSubmit={handleUploadDocument}
              className={`p-4 bg-[#FAF9F6] border rounded-lg space-y-4 transition-all ${
                highlightField === "doc"
                  ? "border-red-500 ring-2 ring-red-200 bg-red-50/20"
                  : "border-[#E7E5E0]"
              }`}
            >
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#57534E]">
                Upload New Verification Document
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-xs text-[#57534E] mb-1">
                    Document Classification *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A]"
                  >
                    <option value="id">
                      Citizenship / Passport / ID Proof
                    </option>
                    <option value="address_proof">
                      Address Proof / Ward Recommendation
                    </option>
                    <option value="organization">
                      NGO / Organization Registration
                    </option>
                    <option value="other">Other Supporting Verification</option>
                  </select>
                </div>

                <div className="sm:col-span-5">
                  <label className="block text-xs text-[#57534E] mb-1">
                    Select File (PDF, JPG, PNG) *
                  </label>
                  <input
                    ref={docFileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(e) =>
                      setDocFile(e.target.files ? e.target.files[0] : null)
                    }
                    className="w-full text-xs text-[#78716C] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white file:text-[#0D5C3A] file:border-[#D6D3D1] cursor-pointer"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={isUploadingDoc || !docFile}
                    className="w-full py-2 px-3 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:bg-[#A8A29E] text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isUploadingDoc ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Uploaded Documents Table/List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[#1C1917]">
                Uploaded Documents
              </h4>

              {documents.length === 0 ? (
                <div className="p-8 border border-dashed border-[#D6D3D1] rounded-lg text-center space-y-2">
                  <FileText className="w-8 h-8 text-[#A8A29E] mx-auto stroke-1" />
                  <p className="text-xs text-[#78716C]">
                    No creator verification documents uploaded yet.
                  </p>
                  <p className="text-[11px] text-amber-800 font-medium">
                    At least one official verification document is required
                    before creating a campaign.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5F4F0] border border-[#E7E5E0] rounded-lg overflow-hidden">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF9F6] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-5 h-5 text-[#0D5C3A] shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#1C1917]">
                            {doc.document_name || "Verification Document"}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-[#78716C] mt-0.5">
                            <span className="font-medium text-[#44403C]">
                              {doc.document_type_display || doc.document_type}
                            </span>
                            {doc.uploaded_at && (
                              <>
                                <span>·</span>
                                <span>
                                  Uploaded{" "}
                                  {new Date(
                                    doc.uploaded_at,
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.document_url && (
                          <a
                            href={doc.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#0D5C3A] hover:underline px-2 py-1"
                          >
                            View
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/my-donations"
              className="p-5 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-xl transition-colors group flex flex-col justify-between shadow-xs"
            >
              <div>
                <Heart className="w-5 h-5 text-[#0D5C3A] mb-2" />
                <div className="font-semibold text-sm text-[#1C1917] group-hover:text-[#0D5C3A]">
                  My Donations
                </div>
                <p className="text-xs text-[#78716C] mt-1">
                  View contribution history, payment status, and download tax
                  receipts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#0D5C3A] pt-4 block">
                View Records →
              </span>
            </Link>

            <Link
              href="/my-recurring-donations"
              className="p-5 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-xl transition-colors group flex flex-col justify-between shadow-xs"
            >
              <div>
                <RefreshCw className="w-5 h-5 text-[#0D5C3A] mb-2" />
                <div className="font-semibold text-sm text-[#1C1917] group-hover:text-[#0D5C3A]">
                  Recurring Pledges
                </div>
                <p className="text-xs text-[#78716C] mt-1">
                  Manage ongoing weekly, monthly, or yearly sustained
                  contributions.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#0D5C3A] pt-4 block">
                Manage Pledges →
              </span>
            </Link>

            <Link
              href="/start-a-campaign"
              className="p-5 bg-white border border-[#E7E5E0] hover:border-[#0D5C3A] rounded-xl transition-colors group flex flex-col justify-between shadow-xs"
            >
              <div>
                <PlusCircle className="w-5 h-5 text-[#0D5C3A] mb-2" />
                <div className="font-semibold text-sm text-[#1C1917] group-hover:text-[#0D5C3A]">
                  Start a Campaign
                </div>
                <p className="text-xs text-[#78716C] mt-1">
                  Submit an urgent health, education, or disaster appeal for
                  verification.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#0D5C3A] pt-4 block">
                Launch Appeal →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
