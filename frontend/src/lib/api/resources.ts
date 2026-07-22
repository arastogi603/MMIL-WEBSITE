import { apiClient } from './client';

export interface ResourceFolder {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  description?: string;
  techStack: string[];
  url: string;
  folder?: ResourceFolder;
  publishedBy?: { id: string, name: string };
  createdAt?: string;
}

export const resourcesApi = {
  getAllFolders: async () => {
    try {
      const response = await apiClient.get('/resources/folders');
      return response.data;
    } catch (e) {
      console.warn("Could not fetch folders, using fallback");
      return [];
    }
  },
  getItemsByFolder: async (folderId: string) => {
    try {
      const response = await apiClient.get(`/resources/folders/${folderId}/items`);
      return response.data;
    } catch (e) {
      console.warn("Could not fetch items, using fallback");
      return [];
    }
  },
  createFolder: async (data: Partial<ResourceFolder>) => {
    const response = await apiClient.post('/resources/folders', data);
    return response.data;
  },
  deleteFolder: async (folderId: string) => {
    const response = await apiClient.delete(`/resources/folders/${folderId}`);
    return response.data;
  },
  createItem: async (folderId: string, data: Partial<ResourceItem>) => {
    const response = await apiClient.post(`/resources/folders/${folderId}/items`, data);
    return response.data;
  },
  deleteItem: async (itemId: string) => {
    const response = await apiClient.delete(`/resources/items/${itemId}`);
    return response.data;
  }
};
