import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept auth requests
    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/signup')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, let the application handle the redirect
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
