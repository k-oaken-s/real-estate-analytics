'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PriceTrend } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface PriceTrendChartProps {
  trends: PriceTrend[];
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ trends }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>価格トレンド</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => format(new Date(value), 'yyyy年MM月', { locale: ja })}
              />
              <YAxis
                yAxisId="price"
                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万円`}
              />
              <YAxis
                yAxisId="count"
                orientation="right"
                dataKey="transactionCount"
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="averagePrice"
                stroke="#2563eb"
                name="平均価格"
              />
              <Line
                yAxisId="count"
                type="monotone"
                dataKey="transactionCount"
                stroke="#10b981"
                name="取引件数"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};