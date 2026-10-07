import { apiClient } from '../lib/api';
import { mockCampaigns, mockSubscriptionPlans, mockCampaignDocuments } from '../mock/campaigns';
import { Campaign, SubscriptionPlan, CampaignDocument, BackendCategory } from '../types';

export const campaignService = {
  /**
   * GET /api/campaign/campaign-action/
   * Returns list of approved & active campaigns
   */
  async getPublicCampaigns(): Promise<Campaign[]> {
    try {
      const res = await apiClient<Campaign[]>('api/campaign/campaign-action/', {
        method: 'GET',
      });
      return res.data;
    } catch (err: any) {
      // In development fallback, return mock campaigns
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockCampaigns;
      }
      throw err;
    }
  },

  /**
   * GET /api/campaign/campaign-action/<id>/ or lookup in list
   */
  async getCampaignById(id: number): Promise<Campaign | null> {
    try {
      const res = await apiClient<Campaign>(`api/campaign/campaign-action/${id}/`, {
        method: 'GET',
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const found = mockCampaigns.find((c) => c.id === id);
        return found || null;
      }
      throw err;
    }
  },

  /**
   * POST /api/campaign/campaign-action/
   * Supports multipart/form-data for campaign image and verification documents
   */
  async createCampaign(data: FormData | {
    title: string;
    description: string;
    category: BackendCategory;
    goal_amount: number;
    is_active?: boolean;
    image?: File | null;
    image_url?: string;
    document?: File | null;
    document_type?: string;
  }): Promise<Campaign> {
    let body: FormData;
    let fallbackTitle = 'New Campaign';
    let fallbackCategory: BackendCategory = 'HEALTH';
    let fallbackGoal = 100000;
    let fallbackDesc = '';

    if (data instanceof FormData) {
      body = data;
      fallbackTitle = (data.get('title') as string) || fallbackTitle;
      fallbackCategory = ((data.get('category') as BackendCategory) || 'HEALTH');
      fallbackGoal = Number(data.get('goal_amount')) || fallbackGoal;
      fallbackDesc = (data.get('description') as string) || fallbackDesc;
    } else {
      body = new FormData();
      body.append('title', data.title);
      body.append('description', data.description);
      body.append('category', data.category);
      body.append('goal_amount', String(data.goal_amount));
      body.append('is_active', String(data.is_active ?? true));

      if (data.image) {
        body.append('image', data.image);
      } else if (data.image_url) {
        body.append('image_url', data.image_url);
      }

      if (data.document) {
        body.append('document', data.document);
        if (data.document_type) {
          body.append('document_type', data.document_type);
        }
      }

      fallbackTitle = data.title;
      fallbackCategory = data.category;
      fallbackGoal = data.goal_amount;
      fallbackDesc = data.description;
    }

    try {
      const res = await apiClient<any>('api/campaign/campaign-action/', {
        method: 'POST',
        requiresAuth: true,
        body,
      });
      return res.data?.data || res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const newCampaign: Campaign = {
          id: Date.now(),
          title: fallbackTitle,
          description: fallbackDesc,
          category: fallbackCategory,
          goal_amount: fallbackGoal,
          current_raised: 0,
          is_active: true,
          is_approved: false,
          donor_count: 0,
          image_url: '/src/assets/images/campaign_health_maya_1790232042675.jpg',
          organizer_name: 'You (Organizer)',
          created_at: new Date().toISOString(),
        };
        mockCampaigns.unshift(newCampaign);
        return newCampaign;
      }
      throw err;
    }
  },

  /**
   * POST /api/campaign/document-view/<campaignId>/
   * Standalone document upload for a campaign
   */
  async uploadDocument(campaignId: number, file: File, documentType: string): Promise<CampaignDocument> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);

    const res = await apiClient<CampaignDocument>(`api/campaign/document-view/${campaignId}/`, {
      method: 'POST',
      requiresAuth: true,
      body: formData,
    });
    return res.data;
  },

  /**
   * GET /api/campaign/subscription-plan/
   */
  async getSubscriptionPlans(campaignId?: number): Promise<SubscriptionPlan[]> {
    try {
      const res = await apiClient<SubscriptionPlan[]>('api/campaign/subscription-plan/', {
        method: 'GET',
      });
      if (campaignId) {
        return res.data.filter((p) => p.campaign === campaignId);
      }
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        if (campaignId && mockSubscriptionPlans[campaignId]) {
          return mockSubscriptionPlans[campaignId];
        }
        return Object.values(mockSubscriptionPlans).flat();
      }
      throw err;
    }
  },

  /**
   * GET /api/campaign/document-view/<campaign>/
   * Document metadata for verification status (details kept safe by backend)
   */
  async getCampaignDocuments(campaignId: number): Promise<CampaignDocument[]> {
    try {
      const res = await apiClient<CampaignDocument[]>(`api/campaign/document-view/${campaignId}/`, {
        method: 'GET',
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        return mockCampaignDocuments[campaignId] || [];
      }
      throw err;
    }
  },
};
