'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Property } from '@/lib/api';

interface DetailedStatsProps {
    properties: Property[];
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({ properties }) => {
    // 価格帯ごとの物件数を計算
    const priceRangeDistribution = properties.reduce((acc, property) => {
        const priceRange = Math.floor(property.pricePerSqm / 100000) * 100000;
        const rangeKey = `${(priceRange / 10000).toFixed(0)}万円`;
        acc[rangeKey] = (acc[rangeKey] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const distributionData = Object.entries(priceRangeDistribution)
        .map(([range, count]) => ({
            range,
            count
        }))
        .sort((a, b) => {
            const aValue = parseInt(a.range);
            const bValue = parseInt(b.range);
            return aValue - bValue;
        });

    // 築年数の分布を計算
    const buildingAgeDistribution = properties.reduce((acc, property) => {
        const ageRange = `${Math.floor(property.buildingAge / 5) * 5}〜${Math.floor(property.buildingAge / 5) * 5 + 4}年`;
        acc[ageRange] = (acc[ageRange] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const ageData = Object.entries(buildingAgeDistribution)
        .map(([range, count]) => ({
            range,
            count
        }))
        .sort((a, b) => {
            const aValue = parseInt(a.range);
            const bValue = parseInt(b.range);
            return aValue - bValue;
        });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>価格帯分布</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" name="物件数" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>築年数分布</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ageData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#10b981" name="物件数" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>統計サマリー</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">平均面積</div>
                            <div className="text-xl font-bold">
                                {(properties.reduce((sum, p) => sum + p.landArea, 0) / properties.length).toFixed(1)}㎡
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">平均築年数</div>
                            <div className="text-xl font-bold">
                                {(properties.reduce((sum, p) => sum + p.buildingAge, 0) / properties.length).toFixed(1)}年
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">最高価格</div>
                            <div className="text-xl font-bold">
                                {Math.max(...properties.map(p => p.totalPrice)).toLocaleString()}万円
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-500">最低価格</div>
                            <div className="text-xl font-bold">
                                {Math.min(...properties.map(p => p.totalPrice)).toLocaleString()}万円
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};