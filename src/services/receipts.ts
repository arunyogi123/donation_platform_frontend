import { apiClient } from '../lib/api';
import { mockBillingRecords } from '../mock/billing';
import { BillingRecord } from '../types';

export const receiptService = {
  /**
   * GET /api/receipts/billing/
   */
  async getBillingList(): Promise<BillingRecord[]> {
    try {
      const res = await apiClient<BillingRecord[]>('api/receipts/billing/', {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockBillingRecords;
      }
      throw err;
    }
  },

  /**
   * GET /api/receipts/billing/<id>/
   */
  async getBillingById(id: number): Promise<BillingRecord | null> {
    try {
      const res = await apiClient<BillingRecord>(`api/receipts/billing/${id}/`, {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const found = mockBillingRecords.find((b) => b.id === id);
        return found || null;
      }
      throw err;
    }
  },
};
