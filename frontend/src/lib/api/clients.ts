import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAreaAnalysis = async (prefecture: string, city: string) => {
  const response = await api.get(`/analysis/area`, {
    params: { prefecture, city }
  });
  return response.data;
};

export default api;