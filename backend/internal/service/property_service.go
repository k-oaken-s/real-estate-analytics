package service

import (
    "context"
	"fmt"
    "real-estate-analytics/internal/domain/model"
    "real-estate-analytics/internal/domain/repository"
    "real-estate-analytics/internal/infrastructure/external/realestate"
    "real-estate-analytics/internal/infrastructure/external/geocoding"
    "time"
)

type PropertyService struct {
    propertyRepo    repository.PropertyRepository
    realEstateClient *realestate.Client
    geocodingClient *geocoding.Client
}

func NewPropertyService(
    propertyRepo repository.PropertyRepository,
    realEstateClient *realestate.Client,
    geocodingClient *geocoding.Client,
) *PropertyService {
    return &PropertyService{
        propertyRepo:    propertyRepo,
        realEstateClient: realEstateClient,
        geocodingClient: geocodingClient,
    }
}

func (s *PropertyService) FetchAndStoreTransactions(ctx context.Context, prefecture, city string) error {
    // 過去3ヶ月分のデータを取得
    to := time.Now()
    from := to.AddDate(0, -3, 0)

    transactions, err := s.realEstateClient.FetchTransactions(ctx, prefecture, city, from, to)
    if err != nil {
        return err
    }

    for _, t := range transactions {
        address := fmt.Sprintf("%s%s%s", t.Prefecture, t.City, t.District)
        coords, err := s.geocodingClient.GetCoordinates(ctx, address)
        if err != nil {
            continue // エラーログを出力して続行
        }

        property := &model.Property{
            Type:           t.Type,
            Prefecture:     t.Prefecture,
            City:          t.City,
            Address:       t.District,
            PricePerSqm:   t.PricePerUnit,
            TotalPrice:    t.TradePrice,
            LandArea:      t.Area,
            BuildingAge:   time.Now().Year() - t.BuildingYear,
            Latitude:      coords.Latitude,
            Longitude:     coords.Longitude,
            TransactionDate: parseTradeDate(t.TradeDate),
        }

        if err := s.propertyRepo.Create(ctx, property); err != nil {
            return err
        }
    }

    return nil
}

func parseTradeDate(dateStr string) time.Time {
    // 日付パース処理の実装
    t, _ := time.Parse("2006-01-02", dateStr)
    return t
}