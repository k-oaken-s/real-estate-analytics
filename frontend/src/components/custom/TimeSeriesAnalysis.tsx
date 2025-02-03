'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property } from "@/lib/api";
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Bar,
} from 'recharts';

interface TimeSeriesAnalysisProps {
    properties: Property[];
}

export const TimeSeriesAnalysis: React.FC<TimeSeriesAnalysisProps> = ({ properties }) => {
    // 月次データの集計
    const monthlyData = properties.reduce((acc, property) => {
        const month = format(new Date(property.transactionDate), 'yyyy-MM');
        if (!acc[month]) {
            acc[month] = {
                month,
                avgPrice: property.pricePerSqm,
                count: 1,
                totalPrice: property.pricePerSqm,
                minPrice: property.pricePerSqm,
                maxPrice: property.pricePerSqm,
            };
        } else {
            acc[month].count += 1;
            acc[month].totalPrice += property.pricePerSqm;
            acc[month].avgPrice = acc[month].totalPrice / acc[month].count;
            acc[month].minPrice = Math.min(acc[month].minPrice, property.pricePerSqm);
            acc[month].maxPrice = Math.max(acc[month].maxPrice, property.pricePerSqm);
        }
        return acc;
    }, {} as Record<string, any>);

    const timeSeriesData = Object.values(monthlyData).sort((a, b) =>
        new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    // 移動平均の計算
    const movingAverageWindow = 3;
    timeSeriesData.forEach((data, index) => {
        if (index >= movingAverageWindow - 1) {
            const sum = timeSeriesData
                .slice(index - movingAverageWindow + 1, index + 1)
                .reduce((acc, curr) => acc + curr.avgPrice, 0);
            data.movingAverage = sum / movingAverageWindow;
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>価格トレンド詳細分析</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={timeSeriesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(value) => format(new Date(value), 'yyyy年MM月', { locale: ja })}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tickFormatter={(value) => `${(value / 10000).toFixed(0)}万円`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    dataKey="count"
                                />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    yAxisId="right"
                                    dataKey="count"
                                    fill="#8884d8"
                                    name="取引件数"
                                    opacity={0.3}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="avgPrice"
                                    stroke="#82ca9d"
                                    name="平均価格"
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="movingAverage"
                                    stroke="#ff7300"
                                    name="移動平均（3ヶ月）"
                                    dot={false}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};