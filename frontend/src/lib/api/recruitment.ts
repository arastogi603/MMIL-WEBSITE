import { apiClient } from "./client";

export const recruitmentApi = {
  getActiveCycles: async () => {
    const response = await apiClient.get('/recruitment/active');
    return response.data;
  },

  getAllCycles: async () => {
    const response = await apiClient.get('/recruitment/all');
    return response.data;
  },

  getCycleBySlug: async (slug: string) => {
    const response = await apiClient.get(`/recruitment/${slug}`);
    return response.data;
  },

  createCycle: async (data: any) => {
    const response = await apiClient.post('/recruitment', data);
    return response.data;
  },

  activateCycle: async (slug: string) => {
    const response = await apiClient.post(`/recruitment/${slug}/activate`);
    return response.data;
  },

  closeCycle: async (slug: string) => {
    const response = await apiClient.post(`/recruitment/${slug}/close`);
    return response.data;
  },

  submitApplication: async (slug: string, data: any) => {
    const response = await apiClient.post(`/recruitment/${slug}/apply`, data);
    return response.data;
  },

  getApplications: async () => {
    const response = await apiClient.get('/recruitment/applications');
    return response.data;
  },

  updateApplicationStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/recruitment/applications/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
