import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5001/api',
});

// Add a request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchProblems = () => API.get('/problems');
export const createProblem = (data) => API.post('/problems', data);
export const markRevised = (id) => API.patch(`/problems/${id}/revise`);
export const undoMarkRevised = (id) => API.patch(`/problems/${id}/undo-revise`);
export const getStats = () => API.get('/problems/stats');
export const searchLeetCode = (concept, difficulty) => API.get(`/leetcode/search?concept=${concept}&difficulty=${difficulty}`);
export const fetchConcepts = () => API.get('/leetcode/concepts');
export const deleteProblem = (id) => API.delete(`/problems/${id}`);
export const fetchNeetCode = () => API.get('/neetcode');

export default API;
