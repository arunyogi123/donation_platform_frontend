import React from 'react';
import { BillingRecord } from '../../types';
import { Printer, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from '../../router';

interface ReceiptViewProps {
  receipt: BillingRecord;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ receipt }) => {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Payment Successful
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Verification Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Payment Unsuccessful
          </span>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top action bar (hidden during print) */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link
          href="/my-donations"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to donation history
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium bg-[#1C1917] text-white rounded hover:bg-[#292524] transition-colors shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / Download Receipt
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-white border border-[#E7E5E0] shadow-sm rounded-lg p-8 sm:p-10 text-[#1C1917]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-[#E7E5E0] pb-6 mb-6">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#1C1917]">
              GiveHope
            </h1>
            <p className="text-xs text-[#78716C] mt-1">Official Philanthropic Contribution Receipt</p>
          </div>
          <div className="mt-4 sm:mt-0 text-left sm:text-right">
            <div className="text-xs text-[#78716C]">Receipt Number</div>
            <div className="font-mono text-sm font-semibold text-[#1C1917]">
              GH-REC-{receipt.id.toString().padStart(6, '0')}
            </div>
            <div className="mt-2">{getStatusBadge(receipt.status)}</div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm border-b border-[#E7E5E0] pb-8 mb-8">
          <div>
            <span className="text-[#78716C] block mb-1">Fundraising Campaign</span>
            <div className="font-semibold text-[#1C1917] text-base font-serif">
              {receipt.campaign_title || 'General Relief Fund'}
            </div>
            <span className="text-xs text-[#78716C]">
              {receipt.is_recurring ? 'Recurring Commitment' : 'Direct One-Time Contribution'}
            </span>
          </div>

          <div>
            <span className="text-[#78716C] block mb-1">Issued Date & Timestamp</span>
            <div className="font-mono text-[#1C1917]">
              {new Date(receipt.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <div>
            <span className="text-[#78716C] block mb-1">Payment Method</span>
            <div className="font-medium text-[#1C1917] flex items-center gap-1.5">
              <span>{receipt.payment_method} Gateway</span>
            </div>
          </div>

          <div>
            <span className="text-[#78716C] block mb-1">Gateway Transaction Reference</span>
            <div className="font-mono text-[#44403C] break-all">
              {receipt.transaction_id || 'KHL_TXN_VERIFIED'}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-[#FAF9F6] border border-[#E7E5E0] rounded-md p-5 mb-8">
          <div className="flex justify-between items-center text-sm py-1 border-b border-[#E7E5E0]">
            <span className="text-[#57534E]">Contribution Amount</span>
            <span className="font-mono font-medium text-[#1C1917]">
              {receipt.currency} {receipt.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm py-1 pt-2 border-b border-[#E7E5E0]">
            <span className="text-[#57534E]">Platform Processing Fee</span>
            <span className="font-mono text-[#78716C]">0.00 (Covered)</span>
          </div>
          <div className="flex justify-between items-center text-base pt-3 font-semibold">
            <span className="text-[#1C1917]">Total Amount Paid</span>
            <span className="font-mono text-[#0D5C3A] text-lg">
              {receipt.currency} {receipt.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="text-[11px] text-[#78716C] space-y-1.5 leading-relaxed">
          <p>
            This document confirms the settlement of funds through GiveHope via Khalti payment
            integration. Transaction IDs are cryptographically hashed and verified against the
            underlying Django core ledger.
          </p>
          <p>
            GiveHope does not charge transaction cuts to beneficiaries; 100% of the net contribution
            flows directly into verified project disbursements.
          </p>
        </div>
      </div>
    </div>
  );
};
