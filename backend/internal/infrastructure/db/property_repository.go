package db

import (
	"context"
	"real-estate-analytics/internal/domain/model"

	"gorm.io/gorm"
)

type propertyRepository struct {
    db *gorm.DB
}

func NewPropertyRepository(db *gorm.DB) *propertyRepository {
    return &propertyRepository{db: db}
}

func (r *propertyRepository) Create(ctx context.Context, property *model.Property) error {
    return r.db.WithContext(ctx).Create(property).Error
}

func (r *propertyRepository) FindByID(ctx context.Context, id uint) (*model.Property, error) {
    var property model.Property
    if err := r.db.WithContext(ctx).First(&property, id).Error; err != nil {
        return nil, err
    }
    return &property, nil
}

func (r *propertyRepository) FindByArea(ctx context.Context, prefecture, city string) ([]*model.Property, error) {
    var properties []*model.Property
    err := r.db.WithContext(ctx).
        Where("prefecture = ? AND city = ?", prefecture, city).
        Find(&properties).Error
    return properties, err
}

func (r *propertyRepository) UpdateStats(ctx context.Context, stats *model.AreaStats) error {
    return r.db.WithContext(ctx).Save(stats).Error
}

func (r *propertyRepository) GetStats(ctx context.Context, prefecture, city string) (*model.AreaStats, error) {
    var stats model.AreaStats
    if err := r.db.WithContext(ctx).
        Where("prefecture = ? AND city = ?", prefecture, city).
        First(&stats).Error; err != nil {
        return nil, err
    }
    return &stats, nil
}