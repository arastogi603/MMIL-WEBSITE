import { apiClient } from './client';

export const projectsApi = {
  getPublicProjects: async () => {
    try {
      const response = await apiClient.get('/projects');
      return response.data || [];
    } catch (error) {
      console.warn("Failed to fetch public projects:", error);
      return [];
    }
  },
  getProjectBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(`/projects/${slug}`);
      return response.data;
    } catch (error) {
      console.warn(`Failed to fetch project by slug (${slug}):`, error);
      return null;
    }
  },
  getAllProjects: async () => {
    try {
      const response = await apiClient.get('/projects/all');
      return response.data || [];
    } catch (error) {
      console.warn("Failed to fetch all projects:", error);
      return [];
    }
  },
  updateStatus: async (slug: string, status: string) => {
    const response = await apiClient.post(`/projects/${slug}/status`, null, {
      params: { status }
    });
    return response.data;
  }
};

