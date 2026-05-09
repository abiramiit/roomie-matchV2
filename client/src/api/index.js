import api from './axios'

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  uploadAvatar: (form) => api.post('/users/avatar', form),
  uploadPhotos: (form) => api.post('/users/photos', form),
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  saveProfile: (id) => api.post(`/users/${id}/save`),
  getSaved: () => api.get('/users/saved'),
}

export const matchAPI = {
  getMatches: () => api.get('/matches'),
  getMyMatches: () => api.get('/matches/my'),
  like: (id) => api.post(`/matches/like/${id}`),
  dislike: (id) => api.post(`/matches/dislike/${id}`),
  getNotifications: () => api.get('/matches/notifications'),
  markRead: () => api.put('/matches/notifications/read'),
}

export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (userId, data) => api.post(`/messages/${userId}`, data),
}

export const listingAPI = {
  getListings: (params) => api.get('/listings', { params }),
  getMyListings: () => api.get('/listings/my'),
  getById: (id) => api.get(`/listings/${id}`),
  create: (form) => api.post('/listings', form),
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getListings: () => api.get('/admin/listings'),
  toggleListing: (id) => api.put(`/admin/listings/${id}/toggle`),
}
