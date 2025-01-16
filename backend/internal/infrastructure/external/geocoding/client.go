package geocoding

import (
	"context"
	"fmt"
	"time"

	"github.com/go-resty/resty/v2"
)

type Client struct {
    httpClient *resty.Client
    apiKey     string
}

type Coordinates struct {
    Latitude  float64
    Longitude float64
}

func NewClient(apiKey string) *Client {
    client := resty.New()
    client.SetTimeout(10 * time.Second)
    client.SetRetryCount(2)

    return &Client{
        httpClient: client,
        apiKey:     apiKey,
    }
}

func (c *Client) GetCoordinates(ctx context.Context, address string) (*Coordinates, error) {
    // 注: ここではGoogle Maps Geocoding APIを使用する例を示しています
    _, err := c.httpClient.R().
        SetContext(ctx).
        SetQueryParam("address", address).
        SetQueryParam("key", c.apiKey).
        Get("https://maps.googleapis.com/maps/api/geocode/json")

    if err != nil {
        return nil, fmt.Errorf("failed to get coordinates: %w", err)
    }

    // レスポンスのパース処理
    // ... 実際のAPIレスポンス形式に合わせて実装 ...

    return &Coordinates{
        Latitude:  35.6812362,
        Longitude: 139.7671248,
    }, nil
}