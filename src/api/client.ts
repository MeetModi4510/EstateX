const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, options);
  if (response.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/broker-login')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return response;
};

export const fetchPublicProperties = async (queryString: string = '') => {
  const url = queryString ? `${API_URL}/properties/public?${queryString}` : `${API_URL}/properties/public`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
};

export const fetchPropertyById = async (id: string) => {
  const response = await fetch(`${API_URL}/properties/public/${id}`);
  if (!response.ok) throw new Error('Failed to fetch property');
  return response.json();
};

export const recordPropertyView = async (id: string) => {
  try {
    await fetch(`${API_URL}/properties/public/${id}/view`, { method: 'POST' });
  } catch (err) {
    console.error('Failed to record property view', err);
  }
};

export const submitInquiry = async (data: any) => {
  const response = await fetch(`${API_URL}/leads/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to submit inquiry');
  return response.json();
};

export const brokerLogin = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/broker-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    let errorMsg = 'Failed to login';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const updateProfile = async (data: any) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update profile';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

// You can add more authenticated calls here by passing the JWT token in headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const fetchOwnerProperties = async () => {
  const response = await apiFetch(`${API_URL}/properties/owner`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch owner properties');
  return response.json();
};

export const fetchOwnerAnalytics = async () => {
  const response = await apiFetch(`${API_URL}/properties/owner/analytics`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch owner analytics');
  return response.json();
};

export const createPropertyDraft = async (data: any) => {
  const response = await apiFetch(`${API_URL}/properties/owner`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create property draft');
  return response.json();
};

export const updatePropertyDraft = async (id: string, data: any) => {
  const response = await apiFetch(`${API_URL}/properties/owner/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    let errorMsg = 'Failed to update property draft';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const submitProperty = async (id: string) => {
  const response = await apiFetch(`${API_URL}/properties/owner/${id}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    let errorMsg = 'Failed to submit property';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const uploadPropertyImages = async (id: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const token = localStorage.getItem('token');
  const response = await apiFetch(`${API_URL}/properties/${id}/images`, {
    method: 'POST',
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      // Do NOT set Content-Type here; browser sets it automatically with boundary for FormData
    },
    body: formData
  });
  if (!response.ok) {
    let errorMsg = 'Failed to upload images';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const deletePropertyImage = async (propertyId: string, imageId: string) => {
  const response = await apiFetch(`${API_URL}/properties/${propertyId}/images/${imageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete image');
  return response.json();
};

export const setPropertyCoverImage = async (propertyId: string, imageId: string) => {
  const response = await apiFetch(`${API_URL}/properties/${propertyId}/images/${imageId}/cover`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to set cover image');
  return response.json();
};

export const fetchBrokerPendingProperties = async () => {
  const response = await apiFetch(`${API_URL}/properties/broker/pending`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch pending properties');
  return response.json();
};

export const approveProperty = async (id: string) => {
  const response = await apiFetch(`${API_URL}/properties/broker/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    let errorMsg = 'Failed to approve property';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

export const rejectProperty = async (id: string, reason: string) => {
  const response = await apiFetch(`${API_URL}/properties/broker/${id}/reject`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ reason })
  });
  if (!response.ok) {
    let errorMsg = 'Failed to reject property';
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
};

// --- BROKER APIs for Leads, Visits, Deals, Notes ---

export const fetchBrokerLeads = async (queryString: string = '') => {
  const url = queryString ? `${API_URL}/leads/broker?${queryString}` : `${API_URL}/leads/broker`;
  const response = await apiFetch(url, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch leads');
  return response.json();
};

export const fetchBrokerLeadById = async (id: string) => {
  const response = await apiFetch(`${API_URL}/leads/broker/${id}`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch lead');
  return response.json();
};

export const updateLeadStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/leads/broker/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update lead status');
  return response.json();
};

export const markLeadContacted = async (id: string) => {
  const response = await apiFetch(`${API_URL}/leads/broker/${id}/contact`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to mark contacted');
  return response.json();
};

export const addLeadNote = async (id: string, note: string) => {
  const response = await apiFetch(`${API_URL}/leads/broker/${id}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ note }),
  });
  if (!response.ok) throw new Error('Failed to add note');
  return response.json();
};

export const fetchLeadNotes = async (id: string) => {
  const response = await apiFetch(`${API_URL}/leads/broker/${id}/notes`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

export const createVisitRequest = async (data: any) => {
  // Can be called via public (if using submitInquiry with type VISIT) or broker
  const response = await apiFetch(`${API_URL}/visits`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create visit');
  return response.json();
};

export const fetchBrokerVisits = async () => {
  const response = await apiFetch(`${API_URL}/visits/broker`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch visits');
  return response.json();
};

export const updateVisitStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/visits/broker/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update visit status');
  return response.json();
};

export const fetchBrokerDeals = async () => {
  const response = await apiFetch(`${API_URL}/deals/broker`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch deals');
  return response.json();
};

export const createDeal = async (data: any) => {
  const response = await apiFetch(`${API_URL}/deals/broker`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create deal');
  return response.json();
};

export const updateDealStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/deals/broker/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update deal status');
  return response.json();
};

export const fetchBrokerNotifications = async () => {
  const response = await apiFetch(`${API_URL}/notifications/broker`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

export const markNotificationRead = async (id: string) => {
  const response = await apiFetch(`${API_URL}/notifications/broker/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to update notification');
  return response.json();
};

export const deleteBrokerNotification = async (id: string) => {
  const response = await apiFetch(`${API_URL}/notifications/broker/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete notification');
  return response.json();
};

export const fetchOwnerNotifications = async () => {
  const response = await apiFetch(`${API_URL}/notifications/owner`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch owner notifications');
  return response.json();
};

export const markOwnerNotificationRead = async (id: string) => {
  const response = await apiFetch(`${API_URL}/notifications/owner/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to update owner notification');
  return response.json();
};

export const deleteOwnerNotification = async (id: string) => {
  const response = await apiFetch(`${API_URL}/notifications/owner/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to delete owner notification');
  return response.json();
};

// ==========================================
// ADMIN APIs
// ==========================================

export const fetchAdminDashboard = async () => {
  const response = await apiFetch(`${API_URL}/admin/dashboard`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin dashboard');
  return response.json();
};

export const fetchAdminProperties = async () => {
  const response = await apiFetch(`${API_URL}/admin/properties`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin properties');
  return response.json();
};

export const updateAdminPropertyStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/admin/properties/${id}/status`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update property status');
  return response.json();
};

export const archiveAdminProperty = async (id: string) => {
  const response = await apiFetch(`${API_URL}/admin/properties/${id}/archive`, {
    method: 'PUT', headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Failed to archive property');
  return response.json();
};

export const fetchAdminBrokers = async () => {
  const response = await apiFetch(`${API_URL}/admin/brokers`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin brokers');
  return response.json();
};

export const createAdminBroker = async (data: any) => {
  const response = await apiFetch(`${API_URL}/admin/brokers`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create broker');
  return response.json();
};

export const updateAdminBroker = async (id: string, data: any) => {
  const response = await apiFetch(`${API_URL}/admin/brokers/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update broker');
  return response.json();
};

export const updateAdminBrokerStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/admin/brokers/${id}/status`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update broker status');
  return response.json();
};

export const fetchAdminPropertyOwners = async () => {
  const response = await apiFetch(`${API_URL}/admin/property-owners`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin property owners');
  return response.json();
};

export const updateAdminOwnerStatus = async (id: string, status: string) => {
  const response = await apiFetch(`${API_URL}/admin/property-owners/${id}/status`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update owner status');
  return response.json();
};

export const fetchAdminLeads = async () => {
  const response = await apiFetch(`${API_URL}/admin/leads`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin leads');
  return response.json();
};

export const reassignAdminLead = async (id: string, brokerId: string) => {
  const response = await apiFetch(`${API_URL}/admin/leads/${id}/reassign`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ brokerId })
  });
  if (!response.ok) throw new Error('Failed to reassign lead');
  return response.json();
};

export const fetchAdminVisits = async () => {
  const response = await apiFetch(`${API_URL}/admin/visits`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin visits');
  return response.json();
};

export const fetchAdminDeals = async () => {
  const response = await apiFetch(`${API_URL}/admin/deals`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin deals');
  return response.json();
};

export const fetchAdminAnalytics = async () => {
  const response = await apiFetch(`${API_URL}/admin/analytics`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin analytics');
  return response.json();
};

export const fetchAdminActivityLogs = async () => {
  const response = await apiFetch(`${API_URL}/admin/activity-logs`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch admin activity logs');
  return response.json();
};
