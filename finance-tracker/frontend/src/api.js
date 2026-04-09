import axios from 'axios';

const BASE = 'http://localhost:3001/api';

export const api = {
  getCategories: () => axios.get(`${BASE}/categories`).then(r => r.data.data),
  categorize: (text) => axios.post(`${BASE}/categorize`, { text }).then(r => r.data.category),
  addExpense: (data) => axios.post(`${BASE}/expenses`, data).then(r => r.data.data),
  getExpenses: (params) => axios.get(`${BASE}/expenses`, { params }).then(r => r.data.data),
  deleteExpense: (id) => axios.delete(`${BASE}/expenses/${id}`),
  updateExpense: (id, data) => axios.put(`${BASE}/expenses/${id}`, data).then(r => r.data.data),
  getAnalytics: (params) => axios.get(`${BASE}/analytics`, { params }).then(r => r.data.data),
};
