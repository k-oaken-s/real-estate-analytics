INSERT INTO properties (
    type, prefecture, city, address,
    price_per_sqm, total_price, land_area, building_area,
    building_age, transaction_date, latitude, longitude,
    created_at, updated_at
) VALUES
    ('マンション', '東京都', '港区', '六本木', 
     1200000, 85000000, 70.5, 70.5,
     5, '2024-01-01', 35.6628, 139.7317,
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('マンション', '東京都', '港区', '赤坂', 
     1150000, 75000000, 65.2, 65.2,
     8, '2024-01-05', 35.6728, 139.7367,
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('マンション', '東京都', '港区', '麻布', 
     1300000, 95000000, 73.0, 73.0,
     3, '2024-01-10', 35.6565, 139.7389,
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO area_stats (
    prefecture, city, avg_price, median_price,
    transaction_count, price_change, period,
    created_at, updated_at
) VALUES
    ('東京都', '港区', 1216666, 1200000,
     3, 2.5, '2024-01',
     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);