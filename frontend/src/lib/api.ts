import axios from 'axios';
import { AreaAnalysis } from '@/types/api';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAreaAnalysis = async (prefecture: string, city: string): Promise<AreaAnalysis> => {
  try {
    const response = await api.get<AreaAnalysis>('/analysis/area', {
      params: { prefecture, city }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching area analysis:', error);
    throw error;
  }
};