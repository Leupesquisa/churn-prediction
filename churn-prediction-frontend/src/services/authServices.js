import api from './api';
import { ACCESS_TOKEN } from './constants';

const authService = {
  login: async (credentials) => {
    try {
     //   const response = await api.post('/api/auth/login/', credentials);
     //   localStorage.setItem('token', response.data.token);
     //   api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
     //   return response.data;

      const response = await api.post('/api/auth/login/', credentials);
      const token = response.data.token; // Supondo que o token seja retornado como `token`
      
      // Armazena o token no localStorage
      localStorage.setItem(ACCESS_TOKEN, token);
      
      // Define o token para futuras requisições
      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      return response.data;

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
  },
};

export default authService;
