import axios from 'axios';

const api = axios.create({
  baseURL: '',
  withCredentials: true,
});


// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry for login/register
      if (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/register')
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens
        await api.post('/auth/refresh');
        // If success, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect or clear state in AuthContext
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

