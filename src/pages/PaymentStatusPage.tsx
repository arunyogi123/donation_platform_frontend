import React from 'react';
import { useRouter, Link } from '../router';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight, RefreshCw, Heart } from 'lucide-react';

interface PaymentStatusPageProps {
  status: 'success' | 'failed' | 'cancelled' | 'pending';
}

export const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ status }) => {
  const router = useRouter();
  const donationId = router.query.donation_id || router.query.purchase_order_id || '';
  const recurringId = router.query.recurring_id || '';

  const renderContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-[#0D5C3A]" />,
          title: 'Thank you for your donation.',
          subtitle:
            'Your contribution has been successfully submitted and recorded in the GiveHope platform.',
          details:
            'The payment transaction has been settled via Khalti. An official receipt has been issued and stored in your profile records.',
          primaryAction: {
            label: 'View Official Receipt',
            href: donationId ? `/my-donations/${donationId}` : '/my-donations',
          },
          secondaryAction: {
            label: 'Explore More Campaigns',
            href: '/campaigns',
          },
        };

      case 'pending':
        return {
          icon: <RefreshCw className="w-12 h-12 text-amber-600 animate-spin" />,
          title: 'Your payment is being processed.',
          subtitle:
            'The payment gateway is communicating final settlement with our backend services.',
          details:
            'Please allow up to a few minutes for webhook confirmation. You can check your account history anytime to inspect the finalized status.',
          primaryAction: {
            label: 'Go to My Donations',
            href: '/my-donations',
          },
          secondaryAction: {
            label: 'Return to Campaigns',
            href: '/campaigns',
          },
        };

      case 'failed':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-rose-600" />,
          title: 'Your payment could not be completed.',
          subtitle:
            'The payment gateway reported an issue completing the transaction or authentication timed out.',
          details:
            'No funds were deducted from your wallet or bank account. You can review your details and re-attempt the contribution.',
          primaryAction: {
            label: 'Try Donating Again',
            href: '/campaigns',
          },
          secondaryAction: {
            label: 'Return to Home',
            href: '/',
          },
        };

      case 'cancelled':
      default:
        return {
          icon: <XCircle className="w-12 h-12 text-stone-500" />,
          title: 'Your payment was cancelled.',
          subtitle: 'The transaction was stopped before payment authorization was finalized.',
          details:
            'No funds were transferred. If you encountered any unexpected friction during checkout, feel free to contact our team or try again later.',
          primaryAction: {
            label: 'Browse Campaigns',
            href: '/campaigns',
          },
          secondaryAction: {
            label: 'Return to Home',
            href: '/',
          },
        };
    }
  };

  const config = renderContent();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="bg-white border border-[#E7E5E0] rounded-xl p-8 sm:p-12 shadow-xs space-y-6">
        <div className="flex justify-center">{config.icon}</div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            {config.title}
          </h1>
          <p className="text-sm font-medium text-[#44403C]">{config.subtitle}</p>
        </div>

        <p className="text-xs text-[#78716C] leading-relaxed max-w-md mx-auto">{config.details}</p>

        {donationId && (
          <div className="p-3 bg-[#FAF9F6] border border-[#E7E5E0] rounded-md text-xs font-mono text-[#57534E]">
            Reference Donation ID: <strong className="text-[#1C1917]">#{donationId}</strong>
          </div>
        )}

        {recurringId && (
          <div className="p-3 bg-[#FAF9F6] border border-[#E7E5E0] rounded-md text-xs font-mono text-[#57534E]">
            Recurring Pledge ID: <strong className="text-[#1C1917]">#{recurringId}</strong>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={config.primaryAction.href}
            className="w-full sm:w-auto px-6 py-3 bg-[#0D5C3A] hover:bg-[#0A472C] text-white text-xs font-semibold rounded transition-colors shadow-xs"
          >
            {config.primaryAction.label}
          </Link>
          <Link
            href={config.secondaryAction.href}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-[#FAF9F6] border border-[#D6D3D1] text-[#1C1917] text-xs font-medium rounded transition-colors"
          >
            {config.secondaryAction.label}
          </Link>
        </div>
      </div>
    </div>
  );
};
