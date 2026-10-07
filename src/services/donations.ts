import { apiClient } from '../lib/api';
import { mockUserDonations, mockRecurringDonations } from '../mock/donations';
import {
  DonationRecord,
  OneTimeDonationPayload,
  OneTimeDonationResponse,
  RecurringDonationPayload,
  RecurringDonationRecord,
  RecurringDonationResponse,
} from '../types';

export const donationService = {
  /**
   * POST /api/donations/campaign-action/<campaign>/
   * Real DRF endpoint for creating one-time donation
   * Returns { message, donation_id }
   */
  async createOneTimeDonation(
    campaignId: number,
    payload: OneTimeDonationPayload
  ): Promise<OneTimeDonationResponse> {
    try {
      const res = await apiClient<OneTimeDonationResponse>(
        `api/donations/campaign-action/${campaignId}/`,
        {
          method: 'POST',
          requiresAuth: true,
          body: JSON.stringify(payload),
        }
      );
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const generatedId = Math.floor(1000 + Math.random() * 9000);
        // Record in mock session
        const newRecord: DonationRecord = {
          id: generatedId,
          campaign: campaignId,
          amount: payload.amount,
          currency: payload.currency,
          is_anonymous: payload.is_anonymous,
          payment_status: 'PENDING',
          created_at: new Date().toISOString(),
        };
        mockUserDonations.unshift(newRecord);

        return {
          message: 'Donation created, proceed to payment',
          donation_id: generatedId,
        };
      }
      throw err;
    }
  },

  /**
   * POST /api/donations/recurring-view
   * Real DRF endpoint for creating recurring donation
   * Returns { message, recurring_id }
   */
  async createRecurringDonation(
    payload: RecurringDonationPayload
  ): Promise<RecurringDonationResponse> {
    try {
      const bodyPayload = {
        ...payload,
        is_active: payload.is_active !== undefined ? payload.is_active : true,
      };
      const res = await apiClient<any>('api/donations/recurring-view/', {
        method: 'POST',
        requiresAuth: true,
        body: JSON.stringify(bodyPayload),
      });
      return {
        message: res.data?.message || 'Recurring donation created, proceed to payment',
        recurring_id: res.data?.recurring_id ?? res.data?.id,
      };

    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const generatedId = Math.floor(500 + Math.random() * 500);
        const newRecurring: RecurringDonationRecord = {
          id: generatedId,
          campaign: payload.campaign,
          amount: payload.amount,
          currency: payload.currency,
          recurring_timing: payload.recurring_timing,
          is_active: true,
          is_anonymous: payload.is_anonymous,
          is_processing: false,
          created_at: new Date().toISOString(),
          last_payment_status: 'PENDING',
        };
        mockRecurringDonations.unshift(newRecurring);

        return {
          message: 'Recurring donation created, proceed to payment',
          recurring_id: generatedId,
        };
      }
      throw err;
    }
  },

  /**
   * GET /api/donations/campaign-action/<campaign>/
   * Public list of donations for a campaign
   */
  async getCampaignDonations(campaignId: number): Promise<any[]> {
    try {
      const res = await apiClient<any[]>(`api/donations/campaign-action/${campaignId}/`, {
        method: 'GET',
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockUserDonations.filter((d) => d.campaign === campaignId);
      }
      throw err;
    }
  },

  /**
   * GET /api/donations/my-donations/
   * Loads logged-in user's donation history from DRF backend
   */
  async getUserDonationHistory(): Promise<DonationRecord[]> {
    try {
      const res = await apiClient<DonationRecord[]>('api/donations/my-donations/', {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockUserDonations;
      }
      throw err;
    }
  },


  /**
   * GET /api/donations/recurring-view
   * Recurring donations list
   */
  async getUserRecurringDonations(): Promise<RecurringDonationRecord[]> {
    try {
      const res = await apiClient<RecurringDonationRecord[]>('api/donations/recurring-view', {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockRecurringDonations;
      }
      throw err;
    }
  },
};
