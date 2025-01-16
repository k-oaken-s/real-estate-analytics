import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, TrendingUp, Users } from "lucide-react";

interface StatsSummaryProps {
  averagePrice: number;
  predictedPrice: number;
  transactionCount: number;
  priceChange: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({
  averagePrice,
  predictedPrice,
  transactionCount,
  priceChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">現在の平均価格</CardTitle>
          <Building className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ¥{averagePrice.toLocaleString()}/m²
          </div>
          <p className="text-xs text-gray-500">
            前月比 {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
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