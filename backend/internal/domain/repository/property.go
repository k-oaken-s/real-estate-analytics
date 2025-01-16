package repository

import (
    "context"
    "real-estate-analytics/internal/domain/model"
)

type PropertyRepository interface {
    Create(ctx context.Context, property *model.Property) error
    FindByID(ctx context.Context, id uint) (*model.Property, error)
    FindByArea(ctx context.Context, prefecture, city string) ([]*model.Property, error)
    UpdateStats(ctx context.Context, stats *model.AreaStats) error
    GetStats(ctx context.Context, prefecture, city string) (*model.AreaStats, error)
}