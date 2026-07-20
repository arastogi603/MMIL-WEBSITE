import { apiClient } from './client';

export const eventsApi = {
  getPublishedEvents: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  getEventBySlug: async (slug: string) => {
    const response = await apiClient.get(`/events/${slug}`);
    return response.data;
  },
  getAllEvents: async () => {
    const response = await apiClient.get('/events/all');
    return response.data;
  },
  createEvent: async (data: any) => {
    const response = await apiClient.post('/events', data);
    return response.data;
  },
  publishEvent: async (slug: string) => {
    const response = await apiClient.post(`/events/${slug}/publish`);
    return response.data;
  },
  unpublishEvent: async (slug: string) => {
    const response = await apiClient.post(`/events/${slug}/unpublish`);
    return response.data;
  },
  deleteEvent: async (slug: string) => {
    const response = await apiClient.delete(`/events/${slug}`);
    return response.data;
  }
};
