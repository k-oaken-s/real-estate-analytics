export interface PropertyAnalysis {
    area: string;
    currentPrice: number;
    predictedPrice: number;
    confidence: number;
    factors: Factor[];
  }
  
  export interface Factor {
    name: string;
    impact: number;
    trend: 'up' | 'down' | 'stable';
  }
  
  export interface PriceTrend {
    month: string;
    price: number;
    change: number;
  }
  
  export interface AreaStats {
    transactionCount: number;
    averagePrice: number;
    priceChange: number;
  }