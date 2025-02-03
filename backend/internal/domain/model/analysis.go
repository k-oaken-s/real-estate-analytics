package model

type AreaAnalysis struct {
    Area            string          `json:"area"`
    CurrentPrice    float64         `json:"currentPrice"`
    PredictedPrice  float64         `json:"predictedPrice"`
    Confidence      float64         `json:"confidence"`
    TransactionCount int            `json:"transactionCount"`
    PriceChange     float64         `json:"priceChange"`
    PriceTrends     []PriceTrend    `json:"priceTrends"`
    PriceStats      PriceStats      `json:"priceStats"`
    Factors         []Factor        `json:"factors"`
}

type PriceTrend struct {
    Month          string  `json:"month"`
    AveragePrice   float64 `json:"averagePrice"`
    TransactionCount int   `json:"transactionCount"`
    PriceChange    float64 `json:"priceChange"`
}

type PriceStats struct {
    MinPrice       float64 `json:"minPrice"`
    MaxPrice       float64 `json:"maxPrice"`
    MedianPrice    float64 `json:"medianPrice"`
    AverageLandArea float64 `json:"averageLandArea"`
    AverageBuildingAge float64 `json:"averageBuildingAge"`
}

type Factor struct {
    Name     string  `json:"name"`
    Impact   float64 `json:"impact"`
    Trend    string  `json:"trend"`
}