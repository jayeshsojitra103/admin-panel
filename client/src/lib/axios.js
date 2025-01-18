import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // Handle error response
    if (error.response && error.response.status === 401) {
      // Clear local storage
      localStorage.clear();
      // Redirect to login or logout
      window.location.href = "/login"; // Adjust the path as per your application's login route
    }
    return Promise.reject(error);
  }
);

export default api;
