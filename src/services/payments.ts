import { apiClient } from '../lib/api';
import { PaymentUrlResponse } from '../types';

export const paymentService = {
  /**
   * GET /api/payments/donate/<donation_id>/
   * Returns Khalti gateway payment URL
   */
  async getOneTimePaymentUrl(donationId: number): Promise<PaymentUrlResponse> {
    try {
      const res = await apiClient<PaymentUrlResponse>(`api/payments/donate/${donationId}/`, {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        // Return a gateway URL or simulation URL
        return {
          payment_url: `/donation/success?donation_id=${donationId}&gateway=khalti_mock`,
        };
      }
      throw err;
    }
  },

  /**
   * GET /api/payments/recurring/<recurring_id>/
   * Returns Khalti gateway payment URL for recurring mandate
   */
  async getRecurringPaymentUrl(recurringId: number): Promise<PaymentUrlResponse> {
    try {
      const res = await apiClient<PaymentUrlResponse>(`api/payments/recurring/${recurringId}/`, {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return {
          payment_url: `/donation/success?recurring_id=${recurringId}&gateway=khalti_mock`,
        };
      }
      throw err;
    }
  },
};
