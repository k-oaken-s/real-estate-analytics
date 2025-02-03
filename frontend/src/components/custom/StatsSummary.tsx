'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building, TrendingUp, Users } from "lucide-react";
import { PriceStats } from "@/lib/api";

interface StatsSummaryProps {
  currentPrice: number;
  predictedPrice: number;
  transactionCount: number;
  priceChange: number;
  stats: PriceStats;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  currentPrice,
  predictedPrice,
  transactionCount,
  priceChange,
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均価格</CardTitle>
          <Building className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ¥{currentPrice.toLocaleString()}/m²
          </div>
          <p className="text-xs text-gray-500">
            変動率: {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">予測価格(3ヶ月後)</CardTitle>
          <TrendingUp className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ¥{predictedPrice.toLocaleString()}/m²
          </div>
          <p className="text-xs text-gray-500">信頼度 85%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">取引件数</CardTitle>
          <Users className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionCount}件</div>
          <p className="text-xs text-gray-500">直近3ヶ月</p>
        </CardContent>
      </Card>
    </div>
  );
};