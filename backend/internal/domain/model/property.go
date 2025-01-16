package model

import (
	"time"
)

type Property struct {
    ID             uint      `json:"id" gorm:"primaryKey"`
    Type           string    `json:"type"`
    Prefecture     string    `json:"prefecture"`
    City           string    `json:"city"`
    Address        string    `json:"address"`
    PricePerSqm    float64   `json:"price_per_sqm"`
    TotalPrice     float64   `json:"total_price"`
    LandArea       float64   `json:"land_area"`
    BuildingArea   float64   `json:"building_area"`
    BuildingAge    int       `json:"building_age"`
    TransactionDate time.Time `json:"transaction_date"`
    Latitude       float64   `json:"latitude"`
    Longitude      float64   `json:"longitude"`
    CreatedAt      time.Time `json:"created_at"`
    UpdatedAt      time.Time `json:"updated_at"`
}

type AreaStats struct {
    ID            uint      `json:"id" gorm:"primaryKey"`
    Prefecture    string    `json:"prefecture"`
    City          string    `json:"city"`
    AvgPrice      float64   `json:"avg_price"`
    MedianPrice   float64   `json:"median_price"`
    TransactionCount int    `json:"transaction_count"`
    PriceChange   float64   `json:"price_change"`
    Period        string    `json:"period"`
    CreatedAt     time.Time `json:"created_at"`
    UpdatedAt     time.Time `json:"updated_at"`
}