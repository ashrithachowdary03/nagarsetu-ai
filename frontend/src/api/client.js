// Central API helper
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('nagarsetu_token');
  const headers = {
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData vs JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch {
      errorDetail = response.statusText;
    }
    throw new Error(errorDetail);
  }

  // If 204 or no content
  if (response.status === 204) return null;
  return await response.json();
}

export const api = {
  // Auth
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: data }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: data }),
  getMe: () => apiRequest('/auth/me'),

  // Complaints
  submitComplaint: (formData) => apiRequest('/complaints/submit', { method: 'POST', body: formData }),
  listComplaints: (params = {}) => {
    // Strip out undefined/null/empty values before building query string
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '' && v !== 'undefined')
    );
    const qs = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/complaints${qs ? '?' + qs : ''}`);
  },
  getComplaint: (refOrId) => apiRequest(`/complaints/${refOrId}`),
  updateComplaint: (id, data) => apiRequest(`/complaints/${id}`, { method: 'PATCH', body: data }),
  getSimilarComplaints: (id) => apiRequest(`/complaints/${id}/similar`),

  // Stats
  getPublicStats: () => apiRequest('/stats/public'),
  getAdminStats: () => apiRequest('/stats/admin'),
};
