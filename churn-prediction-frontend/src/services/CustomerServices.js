import api from './api';
import { ACCESS_TOKEN } from './constants';

const customerService = {
  getCustomers: async () => {
    const response = await api.get('/customers/');
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}/`);
    return response.data;
  },

  predictChurn: async (customerData) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error('No token available');
    } else {
      try {
        const response = await api.post('/api/predict/', customerData);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },

  saveResult: async (customerID, result) => {
    const response = await api.post('/customers/save/', {
      customerID,
      churnPrediction: result,
    });
    return response.data;
  },

  getChurnStatistics: async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      throw new Error('No token available');
    } else {
      const response = await api.get('/api/churn-statistics/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    }
  },

  getROCCurve: async () => {
    const response = await api.get('/api/roc-curve/');
    return response.data;
  },

  getConfusionMatrix: async () => {
    const response = await api.get('/api/confusion-matrix/');
    return response.data;
  },
};

export default customerService;