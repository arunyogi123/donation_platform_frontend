import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from '../../router';

import { Currency, RecurringTiming } from '../../types';
import { donationService } from '../../services/donations';
import { paymentService } from '../../services/payments';
import { CurrencySelector } from './CurrencySelector';
import { DonationAmount } from './DonationAmount';
import { RecurringSelector } from './RecurringSelector';
import { ShieldCheck, Lock, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

interface DonationFormProps {
  campaignId: number;
  campaignTitle: string;
}

export const DonationForm: React.FC<DonationFormProps> = ({ campaignId, campaignTitle }) => {
  const { user, isAuthenticated, login } = useAuth();
  const router = useRouter();

  const [currency, setCurrency] = useState<Currency>('NPR');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<RecurringTiming>('MONTHLY');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAmountChange = (newAmount: number, customStr: string) => {
    setAmount(newAmount);
    setCustomAmount(customStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage('Please sign in or use 1-click Demo Donor login to proceed with your contribution.');
      return;
    }

    if (amount <= 0) {
      setErrorMessage('Please select or specify a contribution amount greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!isRecurring) {
        // One-time donation via DRF: POST /api/donations/campaign-action/<campaign>/
        const donationRes = await donationService.createOneTimeDonation(campaignId, {
          amount,
          currency,
          is_anonymous: isAnonymous,
        });

        const paymentRes = await paymentService.getOneTimePaymentUrl(donationRes.donation_id);

        if (paymentRes.payment_url.startsWith('http')) {
          window.location.href = paymentRes.payment_url;
        } else {
          router.push(paymentRes.payment_url);
        }
      } else {
        // Recurring donation via DRF: POST /api/donations/recurring-view/
        const recurringRes = await donationService.createRecurringDonation({
          campaign: campaignId,
          amount,
          currency,
          recurring_timing: frequency,
          is_anonymous: isAnonymous,
          is_active: true,
        });

        const paymentRes = await paymentService.getRecurringPaymentUrl(recurringRes.recurring_id);

        if (paymentRes.payment_url.startsWith('http')) {
          window.location.href = paymentRes.payment_url;
        } else {
          router.push(paymentRes.payment_url);
        }
      }
    } catch (err: any) {
      let msg = 'Unable to initialize donation with the payment gateway. Please try again.';
      if (err.data) {
        if (typeof err.data === 'string') msg = err.data;
        else if (err.data.error) msg = err.data.error;
        else if (err.data.detail) msg = err.data.detail;
        else if (err.data.amount) msg = Array.isArray(err.data.amount) ? err.data.amount[0] : String(err.data.amount);
        else if (err.data.recurring_timing) msg = Array.isArray(err.data.recurring_timing) ? err.data.recurring_timing[0] : String(err.data.recurring_timing);
      } else if (err.message && err.message !== 'NETWORK_UNREACHABLE') {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-white border border-[#E7E5E0] rounded-xl p-6 sm:p-8 shadow-xs">
      <div className="border-b border-[#F0EFEA] pb-4 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917]">
          Make a Contribution
        </h2>
        <p className="text-xs sm:text-sm text-[#78716C] mt-1">
          Supporting <span className="font-medium text-[#1C1917]">{campaignTitle}</span>
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-md flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Cadence (One-time vs Recurring) */}
        <RecurringSelector
          isRecurring={isRecurring}
          onTypeChange={setIsRecurring}
          frequency={frequency}
          onFrequencyChange={setFrequency}
        />

        {/* Step 2: Currency */}
        <CurrencySelector value={currency} onChange={setCurrency} />

        {/* Step 3: Amount selection */}
        <DonationAmount
          amount={amount}
          customAmount={customAmount}
          currency={currency}
          onAmountChange={handleAmountChange}
        />

        {/* Anonymous Option */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#D6D3D1] text-[#0D5C3A] focus:ring-[#0D5C3A]"
            />
            <div className="text-xs">
              <span className="font-medium text-[#1C1917]">Make this donation anonymous</span>
              <p className="text-[#78716C] mt-0.5">
                Your name will not be publicly displayed with this donation.
              </p>
            </div>
          </label>
        </div>

        {/* Donor Information */}
        <div className="pt-2 border-t border-[#F0EFEA]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-3">
            Donor Information
          </h4>

          {isAuthenticated && user ? (
            <div className="p-3 bg-[#FAF9F6] border border-[#E7E5E0] rounded-md space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78716C]">Contributing as:</span>
                <span className="font-semibold text-[#1C1917]">{user.full_name || user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">Receipt email:</span>
                <span className="text-[#44403C]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex justify-between">
                  <span className="text-[#78716C]">Contact:</span>
                  <span className="text-[#44403C]">{user.phone}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-md text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Sign in required for donation confirmation & receipt</span>
              </div>
              <p className="text-[#57534E]">
                Official receipts and recurring pledges are recorded directly in your GiveHope donor account.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/login?redirect=/campaigns/${campaignId}`}
                  className="px-3 py-1.5 bg-[#0D5C3A] text-white text-xs font-semibold rounded hover:bg-[#0A472C]"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={() => login({ email: 'donor@givehope.org', password: 'Donor@1234' })}
                  className="px-3 py-1.5 bg-white border border-[#D6D3D1] text-[#1C1917] text-xs font-medium rounded hover:bg-[#FAF9F6] cursor-pointer"
                >
                  1-Click Demo Donor Login
                </button>
              </div>
            </div>
          )}
        </div>


        {/* Khalti Payment Gateway Handshake Note */}
        <div className="p-3.5 bg-[#FAF9F6] border border-[#E7E5E0] rounded-md flex items-center justify-between text-xs text-[#57534E]">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>Secure Checkout via Khalti Gateway</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#78716C]">
            <span>Khalti e-Pay</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || amount <= 0}
          className="w-full py-3.5 px-4 bg-[#0D5C3A] hover:bg-[#0A472C] disabled:bg-[#A8A29E] text-white font-semibold text-sm rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to Khalti Gateway...</span>
            </>
          ) : (
            <>
              <span>
                Proceed to Pay {currency} {amount.toLocaleString()}
              </span>
              <ExternalLink className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-[#78716C] leading-normal flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C3A]" />
          <span>Payment verified directly by the Django backend. Official receipt generated upon completion.</span>
        </p>
      </form>
    </div>
  );
};
