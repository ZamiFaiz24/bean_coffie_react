import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

console.log('🟢 [API Client Init]', {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  env: process.env.NODE_ENV,
});

// Log setiap request
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('🔵 [REQUEST]', {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      endpoint: config.url,
      fullURL: fullUrl,
      headers: config.headers,
    });

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 [AUTH] Token attached:', token.substring(0, 20) + '...');
      } else {
        console.log('🔑 [AUTH] No token found');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ [REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Log setiap response
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ [RESPONSE SUCCESS]', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ [RESPONSE ERROR]', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.response?.config?.url,
      method: error.response?.config?.method,
      fullUrl: `${error.response?.config?.baseURL}${error.response?.config?.url}`,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
