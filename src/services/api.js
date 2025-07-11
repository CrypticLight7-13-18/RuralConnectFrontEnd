import axios from "axios";
import { sanitizeUserInput } from "../utils/security";

// ---------------------------------------------------------------------------
//  Axios base URL and Socket URL configuration
// ---------------------------------------------------------------------------
// In development we rely on Vite proxy (see vite.config.js) so we leave the
// baseURL empty (same-origin). Service calls should prefix paths with "/api".
// In production the env var should be the backend origin, e.g.
//   VITE_BACKEND_URL=https://pharmaconnect-api.onrender.com
// which will make requests hit `${VITE_BACKEND_URL}/api/...`.

export const backendURL = import.meta.env.VITE_BACKEND_URL || "";

// For Socket.IO we need the origin *without* the /api path. If the env var is
// provided we use it, otherwise we fallback to current window origin (dev).
export const socketURL =
  import.meta.env.VITE_BACKEND_URL || window.location.origin;

/**
 * Recursively sanitize request data
 * @param {any} data - Data to sanitize
 * @returns {any} - Sanitized data
 */
const sanitizeRequestData = (data) => {
  if (typeof data === 'string') {
    return sanitizeUserInput(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeRequestData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeRequestData(value);
    }
    return sanitized;
  }
  
  return data;
};

// Rate limiting for client-side requests
class RequestRateLimit {
  constructor() {
    this.requests = new Map();
    this.windowMs = 60000; // 1 minute
    this.maxRequests = 60; // 60 requests per minute
  }

  isAllowed(url) {
    const now = Date.now();
    const requests = this.requests.get(url) || [];
    
    // Filter recent requests
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      console.warn(`Rate limit exceeded for ${url}`);
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(url, recentRequests);
    return true;
  }
}

const rateLimiter = new RequestRateLimit();

const axiosInstance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// ---------------------------------------------------------------------------
//  Request interceptor for security measures
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // Check rate limiting
    if (!rateLimiter.isAllowed(config.url)) {
      return Promise.reject(new Error('Rate limit exceeded. Please slow down.'));
    }

    // Sanitize request data if it exists
    if (config.data && typeof config.data === 'object') {
      config.data = sanitizeRequestData(config.data);
    }

    // Add security headers
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
//  Global error interceptor – converts any axios error to a unified object so
//  individual services/components can handle them consistently.
// ---------------------------------------------------------------------------

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Always attach a readable message
    let message = "Something went wrong";
    if (error.response?.data?.message) message = error.response.data.message;
    else if (error.message) message = error.message;

    // Make the unified error available to callers
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
