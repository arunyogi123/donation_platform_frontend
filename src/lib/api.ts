import { getStoredTokens, storeTokens, clearTokens } from './auth';

const configuredApiBaseUrl =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  import.meta.env.VITE_API_URL ||
  import.meta.env.NEXT_PUBLIC_API_URL;

export const API_BASE_URL = (() => {
  if (typeof window === 'undefined') {
    return configuredApiBaseUrl || 'http://127.0.0.1:8000';
  }

  const apiUrl = new URL(
    configuredApiBaseUrl || `http://${window.location.hostname}:8000`,
    window.location.origin
  );
  const isLoopbackApi = ['localhost', '127.0.0.1'].includes(apiUrl.hostname);
  const isLoopbackFrontend = ['localhost', '127.0.0.1'].includes(
    window.location.hostname
  );

  if (isLoopbackApi && !isLoopbackFrontend) {
    apiUrl.hostname = window.location.hostname;
  }

  return apiUrl.toString().replace(/\/$/, '');
})();

export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Central API Client for Django REST Framework backend
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ data: T; isFromBackend: boolean }> {
  const { requiresAuth = false, headers = {}, ...rest } = options;

  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(headers as Record<string, string>),
  };

  if (isFormData) {
    delete requestHeaders['Content-Type'];
  }

  const tokens = getStoredTokens();
  if (requiresAuth && tokens?.access) {
    requestHeaders['Authorization'] = `Bearer ${tokens.access}`;
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    });

    // 401 Unauthorized handling
    if (response.status === 401 && tokens?.refresh) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.access) {
            storeTokens({ access: refreshData.access, refresh: tokens.refresh });
            requestHeaders['Authorization'] = `Bearer ${refreshData.access}`;
            const retryRes = await fetch(url, { ...rest, headers: requestHeaders });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              return { data: retryData, isFromBackend: true };
            }
          }
        }
      } catch {
        clearTokens();
      }
    }

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { detail: response.statusText };
      }
      throw new ApiError(
        errorBody?.detail || errorBody?.message || `API error (${response.status})`,
        response.status,
        errorBody
      );
    }

    const data = await response.json();
    return { data, isFromBackend: true };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network failure (Django server not reachable yet)
    throw new ApiError('NETWORK_UNREACHABLE', 0, { original: error.message });
  }
}
