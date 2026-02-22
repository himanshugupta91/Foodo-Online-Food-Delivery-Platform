import axios from 'axios';

export const API_URL = "http://localhost:5467/api/v1";


export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach latest access token to every request unless caller already set a valid header.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    const existingAuth = config?.headers?.Authorization;
    const invalidBearerHeader =
      typeof existingAuth === "string" &&
      /^Bearer\s*(null|undefined)?$/i.test(existingAuth.trim());

    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization || invalidBearerHeader) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // On first 401, try refresh-token flow once and then replay the failed request.
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Attempt to get a new access token
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refreshToken
          });

          // If successful, save the new access token
          if (response.data && response.data.data && response.data.data.jwt) {
            localStorage.setItem('jwt', response.data.data.jwt);

            // Update the Authorization header for the original request
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${response.data.data.jwt}`;

            // Retry the original request
            return api(originalRequest);
          }
        } catch (refreshError) {
          // If the refresh token is also invalid/expired, boot the user out
          console.error("Refresh token expired. Logging out...");
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
          window.location.href = '/';
        }
      } else {
        // No refresh token — only redirect if the user was previously authenticated
        const currentJwt = localStorage.getItem('jwt');
        if (currentJwt) {
          localStorage.removeItem('jwt');
          window.location.href = '/';
        }
        // Public users (no JWT at all) — just let the error pass through
      }
    }

    return Promise.reject(error);
  }
);
