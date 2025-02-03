package service

import (
	"context"
	"math"
	"real-estate-analytics/internal/domain/model"
	"real-estate-analytics/internal/domain/repository"
	"sort"
)

type AnalysisService struct {
    propertyRepo repository.PropertyRepository
}

func NewAnalysisService(propertyRepo repository.PropertyRepository) *AnalysisService {
    return &AnalysisService{
        propertyRepo: propertyRepo,
    }
}

func (s *AnalysisService) AnalyzeAreaPrices(ctx context.Context, prefecture, city string) (*model.AreaAnalysis, error) {
    properties, err := s.propertyRepo.FindByArea(ctx, prefecture, city)
    if err != nil {
        return nil, err
    }

    if len(properties) == 0 {
        return &model.AreaAnalysis{
            Area:            city,
            CurrentPrice:    0,
            PredictedPrice:  0,
            Confidence:      0,
            TransactionCount: 0,
            PriceChange:     0,
            PriceTrends:     []model.PriceTrend{},
            PriceStats:      model.PriceStats{},
            Factors:         []model.Factor{},
        }, nil
    }

    trends := s.calculatePriceTrends(properties)
    stats := s.calculatePriceStats(properties)
    factors := s.analyzeFactors(properties)
    priceChange := s.calculatePriceChange(trends)

    return &model.AreaAnalysis{
        Area:            city,
        CurrentPrice:    stats.MedianPrice,
        PredictedPrice:  s.predictFuturePrice(trends),
        Confidence:      0.85,
        TransactionCount: len(properties),
        PriceChange:     priceChange,
        PriceTrends:     trends,
        PriceStats:      stats,
        Factors:         factors,
    }, nil
}

func (s *AnalysisService) calculatePriceTrends(properties []*model.Property) []model.PriceTrend {
    monthlyData := make(map[string]struct {
        totalPrice float64
        count      int
    })

    for _, p := range properties {
        month := p.TransactionDate.Format("2006-01")
        data := monthlyData[month]
        data.totalPrice += p.PricePerSqm
        data.count++
        monthlyData[month] = data
    }

    var trends []model.PriceTrend
    for month, data := range monthlyData {
        avgPrice := data.totalPrice / float64(data.count)
        trends = append(trends, model.PriceTrend{
            Month:            month,
            AveragePrice:     avgPrice,
            TransactionCount: data.count,
        })
    }

    // 日付順にソート
    sort.Slice(trends, func(i, j int) bool {
        return trends[i].Month < trends[j].Month
    })

    // 価格変動率の計算
    if len(trends) > 1 {
        for i := 1; i < len(trends); i++ {
            prevPrice := trends[i-1].AveragePrice
            currPrice := trends[i].AveragePrice
            trends[i].PriceChange = ((currPrice - prevPrice) / prevPrice) * 100
        }
    }

    return trends
}

func (s *AnalysisService) calculatePriceStats(properties []*model.Property) model.PriceStats {
    if len(properties) == 0 {
        return model.PriceStats{}
    }

    prices := make([]float64, len(properties))
    var totalLandArea, totalBuildingAge float64

    for i, p := range properties {
        prices[i] = p.PricePerSqm
        totalLandArea += p.LandArea
        totalBuildingAge += float64(p.BuildingAge)
    }

    sort.Float64s(prices)

    return model.PriceStats{
        MinPrice:           prices[0],
        MaxPrice:           prices[len(prices)-1],
        MedianPrice:        s.calculateMedian(prices),
        AverageLandArea:    totalLandArea / float64(len(properties)),
        AverageBuildingAge: totalBuildingAge / float64(len(properties)),
    }
}

func (s *AnalysisService) calculateMedian(sorted []float64) float64 {
    length := len(sorted)
    if length == 0 {
        return 0
    }

    if length%2 == 0 {
        return (sorted[length/2-1] + sorted[length/2]) / 2
    }
    return sorted[length/2]
}

func (s *AnalysisService) calculatePriceChange(trends []model.PriceTrend) float64 {
    if len(trends) < 2 {
        return 0
    }

    firstPrice := trends[0].AveragePrice
    lastPrice := trends[len(trends)-1].AveragePrice

    return ((lastPrice - firstPrice) / firstPrice) * 100
}

func (s *AnalysisService) predictFuturePrice(trends []model.PriceTrend) float64 {
    if len(trends) < 2 {
        return 0
    }

    var sumX, sumY, sumXY, sumXX float64
    n := float64(len(trends))

    for i, trend := range trends {
        x := float64(i)
        y := trend.AveragePrice
        sumX += x
        sumY += y
        sumXY += x * y
        sumXX += x * x
    }

    slope := (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX)
    intercept := (sumY - slope*sumX) / n

    // 3ヶ月後を予測
    futureX := n + 3
    predictedPrice := slope*futureX + intercept

    // 予測価格が負にならないようにする
    if predictedPrice < 0 {
        return trends[len(trends)-1].AveragePrice
    }

    return predictedPrice
}

func (s *AnalysisService) analyzeFactors(properties []*model.Property) []model.Factor {
    return []model.Factor{
        s.analyzeLocationFactor(properties),
        s.analyzePropertyTypeFactor(properties),
        s.analyzeSizeFactor(properties),
        s.analyzeAgeFactor(properties),
    }
}

func (s *AnalysisService) analyzeLocationFactor(properties []*model.Property) model.Factor {
    // 場所による価格への影響を分析
    clusters := s.createLocationClusters(properties)
    var impact float64
    var trend string

    if len(clusters) > 0 {
        // クラスター間の価格差を分析
        priceVariance := s.calculateClusterPriceVariance(clusters)
        impact = math.Min(priceVariance/10, 10.0) // 10段階でスコア化
        trend = s.determineLocationTrend(clusters)
    }

    return model.Factor{
        Name:   "立地",
        Impact: impact,
        Trend:  trend,
    }
}

func (s *AnalysisService) createLocationClusters(properties []*model.Property) [][]model.Property {
    // 簡易的なクラスタリング実装
    clusters := make([][]model.Property, 0)
    processed := make(map[*model.Property]bool)

    for _, p := range properties {
        if processed[p] {
            continue
        }

        cluster := []model.Property{*p}
        processed[p] = true

        for _, other := range properties {
            if processed[other] {
                continue
            }

            if s.isNearby(p, other) {
                cluster = append(cluster, *other)
                processed[other] = true
            }
        }

        if len(cluster) > 1 {
            clusters = append(clusters, cluster)
        }
    }

    return clusters
}

func (s *AnalysisService) isNearby(p1, p2 *model.Property) bool {
    // 約1km以内を近接とみなす
    const threshold = 0.01 // 緯度経度での約1km
    return math.Abs(p1.Latitude-p2.Latitude) < threshold &&
           math.Abs(p1.Longitude-p2.Longitude) < threshold
}

func (s *AnalysisService) calculateClusterPriceVariance(clusters [][]model.Property) float64 {
    if len(clusters) < 2 {
        return 0
    }

    var clusterAvgs []float64
    for _, cluster := range clusters {
        sum := 0.0
        for _, p := range cluster {
            sum += p.PricePerSqm
        }
        clusterAvgs = append(clusterAvgs, sum/float64(len(cluster)))
    }

    return s.calculateVariance(clusterAvgs)
}

func (s *AnalysisService) calculateVariance(values []float64) float64 {
    if len(values) == 0 {
        return 0
    }

    mean := 0.0
    for _, v := range values {
        mean += v
    }
    mean /= float64(len(values))

    variance := 0.0
    for _, v := range values {
        variance += math.Pow(v-mean, 2)
    }
    variance /= float64(len(values))

    return variance
}

func (s *AnalysisService) determineLocationTrend(clusters [][]model.Property) string {
    // クラスター内の最新の取引価格トレンドを分析
    increasing := 0
    decreasing := 0

    for _, cluster := range clusters {
        if len(cluster) < 2 {
            continue
        }

        // 日付でソート
        sort.Slice(cluster, func(i, j int) bool {
            return cluster[i].TransactionDate.Before(cluster[j].TransactionDate)
        })

        first := cluster[0].PricePerSqm
        last := cluster[len(cluster)-1].PricePerSqm

        if last > first {
            increasing++
        } else if last < first {
            decreasing++
        }
    }

    if increasing > decreasing {
        return "up"
    } else if decreasing > increasing {
        return "down"
    }
    return "stable"
}

// 他のfactorの分析メソッドも同様に実装
func (s *AnalysisService) analyzePropertyTypeFactor(properties []*model.Property) model.Factor {
    return model.Factor{
        Name:   "物件タイプ",
        Impact: 5.0,
        Trend:  "stable",
    }
}

func (s *AnalysisService) analyzeSizeFactor(properties []*model.Property) model.Factor {
    return model.Factor{
        Name:   "面積",
        Impact: 3.0,
        Trend:  "up",
    }
}

func (s *AnalysisService) analyzeAgeFactor(properties []*model.Property) model.Factor {
    return model.Factor{
        Name:   "築年数",
        Impact: 4.0,
        Trend:  "down",
    }
}