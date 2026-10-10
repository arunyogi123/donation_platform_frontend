import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useRouter } from "../router";
import { Lock, Mail, User, Phone, AlertCircle, Loader2 } from "lucide-react";
import { GiveHopeLogo } from "../components/brand/GiveHopeLogo";

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        full_name: fullName.trim(),
        username: fullName.trim().replace(/\s+/g, "_"),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      router.push("/profile");
    } catch (err: any) {
      let msg =
        "Registration failed. Please check your information and try again.";
      if (err.data) {
        if (typeof err.data === "string") msg = err.data;
        else if (err.data.email)
          msg = Array.isArray(err.data.email)
            ? err.data.email[0]
            : String(err.data.email);
        else if (err.data.password)
          msg = Array.isArray(err.data.password)
            ? err.data.password[0]
            : String(err.data.password);
        else if (err.data.detail) msg = err.data.detail;
      } else if (err.message && err.message !== "NETWORK_UNREACHABLE") {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-[#E7E5E0] rounded-xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex justify-center hover:opacity-90 transition-opacity"
          >
            <GiveHopeLogo size="lg" />
          </Link>
          <h1 className="text-lg font-semibold text-[#1C1917] pt-2">
            Create a GiveHope account
          </h1>
          <p className="text-xs text-[#78716C]">
            Join as a donor or fundraiser to support verified humanitarian
            missions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
              />
              <User className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5 sm:top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
              />
              <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5 sm:top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+977-98..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
              />
              <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5 sm:top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
              />
              <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5 sm:top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:bg-[#A8A29E] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#F5F4F0] text-xs text-[#78716C]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#0D5C3A] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
