import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-proyectofinal-g7ete8f3bvcsf7ch.centralus-01.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para inyectar token desde localStorage (clave: 'token')
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // localStorage puede fallar en contextos no-browser; ignorar en ese caso
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
