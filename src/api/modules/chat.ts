import { request } from '../client'

export const chatApi = {
  getConversations: () =>
    request.get<{ conversations: any[] }>('/api/conversations'),

  getMessages: (conversationId: string, params?: { before?: number; limit?: number }) =>
    request.get<{ messages: any[] }>(`/api/conversations/${conversationId}/messages`, { params }),
}
