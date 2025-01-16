package realestate

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/go-resty/resty/v2"
)

const (
    baseURL = "https://www.land.mlit.go.jp/webland/api"
)

type Client struct {
    httpClient *resty.Client
}

type Transaction struct {
    Type           string  `json:"type"`
    Prefecture     string  `json:"prefecture"`
    City           string  `json:"city"`
    District       string  `json:"district"`
    TradePrice    float64 `json:"trade_price"`
    PricePerUnit  float64 `json:"price_per_unit"`
    Area          float64 `json:"area"`
    BuildingYear  int     `json:"building_year"`
    Structure     string  `json:"structure"`
    Purpose       string  `json:"purpose"`
    TradeDate     string  `json:"trade_date"`
}

func NewClient() *Client {
    client := resty.New()
    client.SetTimeout(30 * time.Second)
    client.SetRetryCount(3)

    return &Client{
        httpClient: client,
    }
}

func (c *Client) FetchTransactions(ctx context.Context, prefecture, city string, from, to time.Time) ([]Transaction, error) {
    params := url.Values{}
    params.Add("prefecture", prefecture)
    params.Add("city", city)
    params.Add("from", from.Format("20060102"))
    params.Add("to", to.Format("20060102"))

    resp, err := c.httpClient.R().
        SetContext(ctx).
        SetQueryParamsFromValues(params).
        Get(fmt.Sprintf("%s/TradeListSearch", baseURL))

    if err != nil {
        return nil, fmt.Errorf("failed to fetch transactions: %w", err)
    }

    if resp.StatusCode() != http.StatusOK {
        return nil, fmt.Errorf("unexpected status code: %d", resp.StatusCode())
    }

    // レスポンスのパース処理は実際のAPIレスポンス形式に合わせて実装
    var transactions []Transaction
    // ... パース処理 ...

    return transactions, nil
}