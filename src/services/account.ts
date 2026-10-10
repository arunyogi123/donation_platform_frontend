import { apiClient } from '../lib/api';
import { storeTokens, storeProfile, getStoredProfile, clearTokens } from '../lib/auth';
import { AuthTokens, LoginRequest, RegisterRequest, UserProfile } from '../types';

export const accountService = {
  /**
   * POST /api/account/login/
   */
  async login(credentials: LoginRequest): Promise<{ tokens: AuthTokens; profile: UserProfile }> {
    try {
      const res = await apiClient<AuthTokens>('api/account/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      storeTokens(res.data);
      const profile = await accountService.getProfile();
      return { tokens: res.data, profile };
    } catch (err: any) {
      // Fallback for demonstration when Django backend isn't actively running
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const mockTokens: AuthTokens = {
          access: `mock_jwt_access_${Date.now()}`,
          refresh: `mock_jwt_refresh_${Date.now()}`,
        };
        const mockProfile: UserProfile = {
          email: credentials.email,
          full_name:
            credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
            'Aarav Sharma',
          address: 'Kathmandu, Bagmati, Nepal',
          phone: '+977-9801234567',
          bio: 'Humanitarian advocate supporting emergency medical cases in Nepal.',
          is_creator_ready: true,
          missing_requirements: [],
          documents: [],
          created_at: new Date().toISOString(),
        };
        storeTokens(mockTokens);
        storeProfile(mockProfile);
        return { tokens: mockTokens, profile: mockProfile };
      }
      throw err;
    }
  },

  /**
   * POST /api/account/register/
   */
  async register(data: RegisterRequest): Promise<{ user: any }> {
    try {
      const res = await apiClient<any>('api/account/register/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { user: res.data.user || res.data };
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const mockProfile: UserProfile = {
          email: data.email,
          full_name: data.full_name || data.username || data.email.split('@')[0] || 'User',
          phone: data.phone,
          address: 'Nepal',
          created_at: new Date().toISOString(),
          is_creator_ready: false,
          missing_requirements: ['Profile Picture', 'Verification Document'],
          documents: [],
        };
        storeProfile(mockProfile);
        return { user: mockProfile };
      }
      throw err;
    }
  },

  /**
   * GET /api/account/profile/ (Authenticated)
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const res = await apiClient<UserProfile>('api/account/profile/', {
        method: 'GET',
        requiresAuth: true,
      });
      storeProfile(res.data);
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const cached = getStoredProfile();
        if (cached) return cached;
        const defaultProfile: UserProfile = {
          email: 'donor@givehope.org',
          full_name: 'Aarav Sharma',
          address: 'Jhamsikhel, Lalitpur, Nepal',
          phone: '+977-9841928374',
          bio: 'Humanitarian advocate supporting emergency medical cases in Nepal.',
          is_creator_ready: true,
          missing_requirements: [],
          documents: [],
          created_at: '2026-03-15T09:00:00Z',
        };
        storeProfile(defaultProfile);
        return defaultProfile;
      }
      throw err;
    }
  },

  /**
   * PUT /api/account/profile/ (Authenticated)
   * Supports FormData for profile picture and text fields
   */
  async updateProfile(data: FormData | Record<string, any>): Promise<UserProfile> {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    try {
      const res = await apiClient<UserProfile>('api/account/profile/', {
        method: 'PUT',
        requiresAuth: true,
        body: isFormData ? data : JSON.stringify(data),
      });
      storeProfile(res.data);
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const current = getStoredProfile() || {
          email: 'donor@givehope.org',
          full_name: 'Aarav Sharma',
          created_at: new Date().toISOString(),
        };

        const updated: UserProfile = { ...current };

        if (isFormData) {
          const fn = (data as FormData).get('full_name');
          const ph = (data as FormData).get('phone');
          const addr = (data as FormData).get('address');
          const bio = (data as FormData).get('bio');
          if (fn) updated.full_name = String(fn);
          if (ph) updated.phone = String(ph);
          if (addr) updated.address = String(addr);
          if (bio) updated.bio = String(bio);
        } else {
          Object.assign(updated, data);
        }

        storeProfile(updated);
        return updated;
      }
      throw err;
    }
  },

  /**
   * POST /api/account/profile/documents/
   */
  async uploadCreatorDocument(file: File, documentType: string): Promise<any> {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', documentType);
    formData.append('document_name', file.name);

    try {
      const res = await apiClient<any>('api/account/profile/documents/', {
        method: 'POST',
        requiresAuth: true,
        body: formData,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const newDoc = {
          id: Date.now(),
          document: typeof window !== 'undefined' ? URL.createObjectURL(file) : '',
          document_name: file.name,
          document_type: documentType,
          document_type_display: documentType.toUpperCase(),
          uploaded_at: new Date().toISOString(),
        };
        const current = getStoredProfile();
        if (current) {
          current.documents = [newDoc, ...(current.documents || [])];
          current.is_creator_ready = true;
          current.missing_requirements = (current.missing_requirements || []).filter(
            (r) => r !== 'Verification Document'
          );
          storeProfile(current);
        }
        return newDoc;
      }
      throw err;
    }
  },

  /**
   * DELETE /api/account/profile/documents/<id>/
   */
  async deleteCreatorDocument(id: number): Promise<void> {
    try {
      await apiClient<any>(`api/account/profile/documents/${id}/`, {
        method: 'DELETE',
        requiresAuth: true,
      });
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const current = getStoredProfile();
        if (current && current.documents) {
          current.documents = current.documents.filter((d: any) => d.id !== id);
          storeProfile(current);
        }
        return;
      }
      throw err;
    }
  },

  /**
   * GET /api/account/profile/documents/
   */
  async getCreatorDocuments(): Promise<any[]> {
    try {
      const res = await apiClient<any[]>('api/account/profile/documents/', {
        method: 'GET',
        requiresAuth: true,
      });
      return res.data;
    } catch (err: any) {
      if (err.status === 0 || err.message === 'NETWORK_UNREACHABLE') {
        const current = getStoredProfile();
        return current?.documents || [];
      }
      throw err;
    }
  },

  /**
   * Clear local session tokens & profile
   */
  logout(): void {
    clearTokens();
  },
};

