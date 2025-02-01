import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
});

export interface Property {
  type: string;
  prefecture: string;
  city: string;
  address: string;
  pricePerSqm: number;
  totalPrice: number;
  landArea: number;
  buildingArea: number;
  buildingAge: number;
  transactionDate: string;
  latitude: number;
  longitude: number;
}

export interface AreaAnalysis {
  area: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  factors: {
    name: string;
    impact: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

export const fetchAreaAnalysis = async (prefecture: string, city: string): Promise<AreaAnalysis> => {
  const response = await api.get<AreaAnalysis>('/analysis/area', {
    params: { prefecture, city }
  });
  return response.data;
};

export const fetchProperties = async (prefecture: string, city: string): Promise<Property[]> => {
  const response = await api.get<Property[]>('/properties/fetch', {
    params: { prefecture, city }
  });
  return response.data;
};