package model

type PriceAnalysis struct {
    Area           string    `json:"area"`            // 対象エリア
    CurrentPrice   float64   `json:"current_price"`   // 現在の平均価格
    PredictedPrice float64   `json:"predicted_price"` // 予測価格
    Confidence     float64   `json:"confidence"`      // 予測の信頼度
    Factors        []Factor  `json:"factors"`         // 価格変動要因
}

type Factor struct {
    Name     string  `json:"name"`      // 要因名（人口増減、開発計画など）
    Impact   float64 `json:"impact"`    // 価格への影響度（パーセンテージ）
    Trend    string  `json:"trend"`     // 傾向（上昇/下降）
}

type PriceTrend struct {
    Period    string  `json:"period"`     // 期間（年月）
    AvgPrice  float64 `json:"avg_price"`  // 平均価格
    Change    float64 `json:"change"`     // 前期比変動率
}