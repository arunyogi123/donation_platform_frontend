import React, { useEffect, useState } from 'react';
import { donationService } from '../services/donations';
import { DonationRecord } from '../types';
import { Link } from '../router';
import { useAuth } from '../context/AuthContext';
import { Receipt, CheckCircle2, Clock, AlertTriangle, ArrowRight, Heart } from 'lucide-react';

export const MyDonationsPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const list = await donationService.getUserDonationHistory();
        setDonations(list);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Gateway
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Unsuccessful
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E5E0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">My Donations</h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Official record of your philanthropic contributions, settlement statuses, and verifiable
            receipts.
          </p>
        </div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded self-start sm:self-auto shadow-xs"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Support New Cause</span>
        </Link>
      </div>

      {/* Donations List / Table */}
      <div className="bg-white border border-[#E7E5E0] rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-[#E7E5E0] rounded w-1/4" />
            <div className="h-10 bg-[#E7E5E0] rounded" />
            <div className="h-10 bg-[#E7E5E0] rounded" />
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-[#A8A29E] mx-auto stroke-1" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">No donations recorded yet</h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              When you make a contribution to any active fundraiser, your transaction record and
              official receipt will appear here.
            </p>
            <div className="pt-2">
              <Link
                href="/campaigns"
                className="px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded inline-block"
              >
                Browse Campaigns
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E5E0] text-[#78716C] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Campaign</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4F0] text-[#1C1917]">
                {donations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <Link
                        href={`/campaigns/${item.campaign}`}
                        className="font-medium text-sm text-[#1C1917] hover:text-[#0D5C3A] line-clamp-1"
                      >
                        {item.campaign_title || `Campaign #${item.campaign}`}
                      </Link>
                      <span className="text-[11px] text-[#78716C] font-mono">
                        Donation Ref #{item.id}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-sm tabular-nums whitespace-nowrap">
                      {item.currency} {item.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-[#57534E] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(item.payment_status)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.is_anonymous ? (
                        <span className="text-[#78716C] italic">Anonymous</span>
                      ) : (
                        <span className="text-[#44403C]">Public</span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <Link
                        href={`/my-donations/${item.id}`}
                        className="inline-flex items-center gap-1 font-medium text-[#0D5C3A] hover:underline"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
