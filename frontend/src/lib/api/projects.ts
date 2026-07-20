import { apiClient } from './client';

export const projectsApi = {
  getPublicProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  getProjectBySlug: async (slug: string) => {
    const response = await apiClient.get(`/projects/${slug}`);
    return response.data;
  },
  getAllProjects: async () => {
    const response = await apiClient.get('/projects/all');
    return response.data;
  },
  updateStatus: async (slug: string, status: string) => {
    const response = await apiClient.post(`/projects/${slug}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};
