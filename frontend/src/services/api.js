import axios from 'axios';

// Hardcode Render production URL with localhost fallback for dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://pravah-82qb.onrender.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: inject active role header & JWT token
api.interceptors.request.use((config) => {
  const activeRole = localStorage.getItem('aicte_active_role') || 'college';
  const token = localStorage.getItem('aicte_token');

  config.headers['x-demo-role'] = activeRole;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Endpoints
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getDemoAccounts: () => api.get('/auth/demo-accounts'),
};

// Application Endpoints
export const applicationAPI = {
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  uploadCampusPhoto: (id, formData) =>
    api.post(`/applications/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  simulateSlaBreach: (id, days = 10) =>
    api.post(`/applications/${id}/simulate-breach`, { days }),
  generateDocket: (id) => api.post(`/applications/${id}/generate-docket`),
};

// Scrutiny (RO) Endpoints
export const scrutinyAPI = {
  getQueue: (params) => api.get('/scrutiny/queue', { params }),
  getFacultyRadar: (id) => api.get(`/scrutiny/application/${id}/faculty-radar`),
  flagFacultyDeficiency: (id, data) =>
    api.post(`/scrutiny/application/${id}/faculty-radar/flag-deficiency`, data),
  raiseDeficiency: (id, data) => api.post(`/scrutiny/application/${id}/deficiency`, data),
  resolveDeficiency: (id, deficiencyId, data) =>
    api.post(`/scrutiny/application/${id}/deficiency/${deficiencyId}/resolve`, data),
  passToEVC: (id, data) => api.post(`/scrutiny/application/${id}/pass-evc`, data),
  revert: (id, data) => api.post(`/scrutiny/application/${id}/revert`, data),
  directApprove: (id, data) => api.post(`/scrutiny/application/${id}/approve`, data),
};

// EVC Committee Endpoints
export const evcAPI = {
  getInspections: () => api.get('/evc/inspections'),
  scheduleInspection: (id, data) => api.post(`/evc/inspection/${id}/schedule`, data),
  uploadInspectionPhoto: (id, formData) =>
    api.post(`/evc/inspection/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submitReport: (id, data) => api.post(`/evc/inspection/${id}/report`, data),
};

// Compliance & Validity Radar Endpoints
export const complianceAPI = {
  getUndertakings: (params) => api.get('/compliance/undertakings', { params }),
  submitProof: (id, formData) =>
    api.post(`/compliance/undertakings/${id}/proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verifyUndertaking: (id, data) => api.post(`/compliance/undertakings/${id}/verify`, data),
  getRadar: (params) => api.get('/compliance/documents/radar', { params }),
  dispatchAlert: (data) => api.post('/compliance/documents/alert', data),
  renewDocument: (id, formData) =>
    api.post(`/compliance/documents/${id}/renew`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verifyRenewal: (id, data) => api.post(`/compliance/documents/${id}/verify-renewal`, data),
  verifyOnsite: (id, data) => api.post(`/compliance/documents/${id}/verify-onsite`, data),
  issueShowCause: (id, data) => api.post(`/compliance/documents/${id}/show-cause`, data),
};

// HQ Admin & Executive Endpoints
export const adminAPI = {
  getMetrics: () => api.get('/admin/metrics'),
  getHeatmap: () => api.get('/admin/heatmap'),
  getEscalationMatrix: () => api.get('/admin/escalation-matrix'),
  reassignOfficer: (id, data) => api.post(`/admin/application/${id}/reassign`, data),
  getRules: () => api.get('/admin/rules'),
  updateRules: (data) => api.put('/admin/rules', data),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  reseed: () => api.post('/admin/reseed'),
};

// AI Statutory Compliance Copilot (Google Gemini & APH 2024-27 Engine)
export const aiAPI = {
  ask: (question, conversationHistory = []) =>
    api.post('/ai/ask', { question, conversationHistory }),
};

export default api;
