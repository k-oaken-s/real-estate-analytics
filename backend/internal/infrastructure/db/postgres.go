package db

import (
	"fmt"
	"real-estate-analytics/internal/domain/model"
	"real-estate-analytics/pkg/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func NewPostgresDB(cfg *config.DatabaseConfig) (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Tokyo",
        cfg.Host,
        cfg.User,
        cfg.Password,
        cfg.DBName,
        cfg.Port,
    )

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, fmt.Errorf("failed to connect database: %w", err)
    }

    // マイグレーション実行
    if err := db.AutoMigrate(&model.Property{}, &model.AreaStats{}); err != nil {
        return nil, fmt.Errorf("failed to migrate database: %w", err)
    }

    return db, nil
}