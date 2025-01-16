import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceTrendData {
  month: string;
  price: number;
  change: number;
}

interface PriceTrendChartProps {
  data: PriceTrendData[];
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>価格トレンド</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month"
                tickFormatter={(value) => value.substring(5)} // "2024-01" → "01"
              />
              <YAxis 
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toLocaleString()}円/㎡`, "価格"]}
                labelFormatter={(label) => `${label}月`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};