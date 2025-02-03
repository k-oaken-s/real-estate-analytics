package model

type AreaStatistics struct {
    TotalTransactions int            `json:"totalTransactions"`
    PriceDistribution []Distribution `json:"priceDistribution"`
    AgeDistribution   []Distribution `json:"ageDistribution"`
    SizeDistribution  []Distribution `json:"sizeDistribution"`
}

type Distribution struct {
    Range int `json:"range"`
    Count int `json:"count"`
}

type PriceRangeStats struct {
    MinPrice    float64 `json:"minPrice"`
    MaxPrice    float64 `json:"maxPrice"`
    MedianPrice float64 `json:"medianPrice"`
    MeanPrice   float64 `json:"meanPrice"`
}