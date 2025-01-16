export interface AreaAnalysis {
    area: string;
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    transactionCount: number;
    priceChange: number;
    priceTrends: PriceTrend[];
    factors: Factor[];
  }
  
  export interface PriceTrend {
    month: string;
    price: number;
    change: number;
  }
  
  export interface Factor {
    name: string;
    impact: number;
    trend: 'up' | 'down' | 'stable';
    description?: string;
  }