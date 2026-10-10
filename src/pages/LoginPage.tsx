import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useRouter } from '../router';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { GiveHopeLogo } from '../components/brand/GiveHopeLogo';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      const redirectUrl = router.query.redirect || '/profile';
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white border border-[#E7E5E0] rounded-xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex justify-center hover:opacity-90 transition-opacity">
            <GiveHopeLogo size="lg" />
          </Link>
          <h1 className="text-lg font-semibold text-[#1C1917] pt-2">Sign in to your account</h1>
          <p className="text-xs text-[#78716C]">
            Track your donations, recurring pledges, and official receipts.
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
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="donor@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-[#D6D3D1] rounded-md focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] focus:border-[#0D5C3A]"
              />
              <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-2.5 sm:top-3" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-[#57534E]">Password</label>
            </div>
            <div className="relative">
              <input
                type="password"
                required
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
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign in</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#F5F4F0] text-xs text-[#78716C]">
          Don’t have an account?{' '}
          <Link href="/register" className="font-semibold text-[#0D5C3A] hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
