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
  transactionCount: number;
  priceChange: number;
  priceTrends: PriceTrend[];
  priceStats: PriceStats;
  factors: Factor[];
}

export interface PriceTrend {
  month: string;
  averagePrice: number;
  transactionCount: number;
  priceChange: number;
}

export interface PriceStats {
  minPrice: number;
  maxPrice: number;
  medianPrice: number;
  averageLandArea: number;
  averageBuildingAge: number;
}

export interface Factor {
  name: string;
  impact: number;
  trend: string;
}

export interface AreaStatistics {
  totalTransactions: number;
  priceDistribution: Distribution[];
  ageDistribution: Distribution[];
  sizeDistribution: Distribution[];
}

export interface Distribution {
  range: number;
  count: number;
}

// API関数
export const getAreaAnalysis = async (prefecture: string, city: string): Promise<AreaAnalysis> => {
  const response = await api.get<AreaAnalysis>('/analysis/area', {
      params: { prefecture, city }
  });
  return response.data;
};

export const getAreaStatistics = async (prefecture: string, city: string): Promise<AreaStatistics> => {
  const response = await api.get<AreaStatistics>('/analysis/statistics', {
      params: { prefecture, city }
  });
  return response.data;
};