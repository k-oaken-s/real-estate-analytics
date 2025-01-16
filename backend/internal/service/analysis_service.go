package service

import (
	"context"
	"fmt"
	"real-estate-analytics/internal/domain/model"
	"real-estate-analytics/internal/domain/repository"
)

type AnalysisService struct {
    propertyRepo repository.PropertyRepository
}

func NewAnalysisService(propertyRepo repository.PropertyRepository) *AnalysisService {
    return &AnalysisService{
        propertyRepo: propertyRepo,
    }
}

func (s *AnalysisService) AnalyzeAreaPrices(ctx context.Context, prefecture, city string) (*model.PriceAnalysis, error) {
    // 過去のデータを取得
    properties, err := s.propertyRepo.FindByArea(ctx, prefecture, city)
    if err != nil {
        return nil, err
    }

    // データが存在しない場合のデフォルト値を設定
    if len(properties) == 0 {
        return &model.PriceAnalysis{
            Area:           fmt.Sprintf("%s %s", prefecture, city),
            CurrentPrice:   0,
            PredictedPrice: 0,
            Confidence:     0,
            Factors:        []model.Factor{},
        }, nil
    }

    // 現在の平均価格を計算
    var totalPrice, count float64
    for _, p := range properties {
        totalPrice += p.PricePerSqm
        count++
    }
    currentPrice := totalPrice / count

    // 価格トレンドを分析
    trends := s.analyzePriceTrends(properties)

    // 将来価格を予測
    predictedPrice := s.predictFuturePrice(trends)

    // 影響要因を分析
    factors := s.analyzeFactors(properties)

    return &model.PriceAnalysis{
        Area:           city,
        CurrentPrice:   currentPrice,
        PredictedPrice: predictedPrice,
        Confidence:     0.85, // 仮の値。実際には予測モデルの信頼度を計算
        Factors:        factors,
    }, nil
}

func (s *AnalysisService) analyzePriceTrends(properties []*model.Property) []model.PriceTrend {
    // 月次のトレンドを計算
    trends := make(map[string]struct {
        total float64
        count int
    })

    for _, p := range properties {
        period := p.TransactionDate.Format("2006-01")
        current := trends[period]
        current.total += p.PricePerSqm
        current.count++
        trends[period] = current
    }

    // トレンドデータを構築
    var result []model.PriceTrend
    var lastAvg float64

    for period, data := range trends {
        avgPrice := data.total / float64(data.count)
        change := 0.0
        if lastAvg > 0 {
            change = (avgPrice - lastAvg) / lastAvg * 100
        }

        result = append(result, model.PriceTrend{
            Period:   period,
            AvgPrice: avgPrice,
            Change:   change,
        })

        lastAvg = avgPrice
    }

    return result
}

func (s *AnalysisService) predictFuturePrice(trends []model.PriceTrend) float64 {
    // 単純な線形回帰による予測
    // 注: これは基本的な実装例です。実際にはより複雑な予測モデルを使用します
    var sumX, sumY, sumXY, sumXX float64
    n := float64(len(trends))

    for i, trend := range trends {
        x := float64(i)
        y := trend.AvgPrice
        sumX += x
        sumY += y
        sumXY += x * y
        sumXX += x * x
    }

    // 傾きを計算
    slope := (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX)
    // 切片を計算
    intercept := (sumY - slope*sumX) / n

    // 3ヶ月後の価格を予測
    futureX := n + 3
    predictedPrice := slope*futureX + intercept

    return predictedPrice
}

func (s *AnalysisService) analyzeFactors(properties []*model.Property) []model.Factor {
    // 価格変動要因の分析（簡略化した実装）
    return []model.Factor{
        {
            Name:   "人口動態",
            Impact: 5.2,
            Trend:  "上昇",
        },
        {
            Name:   "交通利便性",
            Impact: 3.8,
            Trend:  "安定",
        },
        {
            Name:   "開発計画",
            Impact: 2.5,
            Trend:  "上昇",
        },
    }
}