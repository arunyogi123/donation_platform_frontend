import React, { useEffect, useState } from 'react';
import { donationService } from '../services/donations';
import { RecurringDonationRecord } from '../types';
import { Link } from '../router';
import { RefreshCw, CheckCircle2, Clock, Calendar, Heart, Shield } from 'lucide-react';

export const MyRecurringDonationsPage: React.FC = () => {
  const [recurringList, setRecurringList] = useState<RecurringDonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecurring = async () => {
      try {
        const list = await donationService.getUserRecurringDonations();
        setRecurringList(list);
      } finally {
        setLoading(false);
      }
    };
    fetchRecurring();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E5E0] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#1C1917]">
            Recurring Commitments
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Active subscriptions providing predictable, ongoing support for medical patients,
            schools, and emergency relief programs.
          </p>
        </div>
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded self-start sm:self-auto shadow-xs"
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Set Up New Pledge</span>
        </Link>
      </div>

      {/* Main List */}
      <div className="bg-white border border-[#E7E5E0] rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-[#E7E5E0] rounded w-1/4" />
            <div className="h-10 bg-[#E7E5E0] rounded" />
            <div className="h-10 bg-[#E7E5E0] rounded" />
          </div>
        ) : recurringList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-10 h-10 text-[#A8A29E] mx-auto stroke-1" />
            <h3 className="font-serif text-lg font-medium text-[#1C1917]">
              No active recurring commitments
            </h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              You can choose to set up weekly, monthly, or yearly contributions on any campaign
              page to support continuous treatment or schooling.
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
                  <th className="py-3 px-4">Amount & Cadence</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Next Charge</th>
                  <th className="py-3 px-4">Last Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F4F0] text-[#1C1917]">
                {recurringList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <Link
                        href={`/campaigns/${item.campaign}`}
                        className="font-medium text-sm text-[#1C1917] hover:text-[#0D5C3A] line-clamp-1"
                      >
                        {item.campaign_title || `Campaign #${item.campaign}`}
                      </Link>
                      <span className="text-[11px] text-[#78716C] font-mono">
                        Pledge Ref #{item.id}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-mono font-medium text-sm tabular-nums">
                        {item.currency} {item.amount.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-[#78716C] uppercase tracking-wider">
                        {item.recurring_timing}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                          Paused
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#57534E] whitespace-nowrap">
                      {item.next_run ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#A8A29E]" />
                          <span>
                            {new Date(item.next_run).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {item.last_payment_status === 'SUCCESS' ? (
                        <span className="text-emerald-700 font-medium">Billed Successfully</span>
                      ) : (
                        <span className="text-amber-700 font-medium">Pending Settlement</span>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      {item.is_anonymous ? (
                        <span className="text-[#78716C] italic">Anonymous</span>
                      ) : (
                        <span className="text-[#44403C]">Public Name</span>
                      )}
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
