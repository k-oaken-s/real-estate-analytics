'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property } from "@/lib/api";
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';

interface PriceHeatmapProps {
    properties: Property[];
}

export const PriceHeatmap: React.FC<PriceHeatmapProps> = ({ properties }) => {
    // 価格と位置情報のデータを生成
    const heatmapData = properties.map(property => ({
        x: property.longitude,
        y: property.latitude,
        z: property.pricePerSqm,
        price: property.pricePerSqm,
        address: property.address,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow border">
                    <p className="font-bold">{data.address}</p>
                    <p>単価: {data.price.toLocaleString()}円/㎡</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>エリア価格分布</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis
                                type="number"
                                dataKey="x"
                                domain={['auto', 'auto']}
                                name="経度"
                            />
                            <YAxis
                                type="number"
                                dataKey="y"
                                domain={['auto', 'auto']}
                                name="緯度"
                            />
                            <ZAxis
                                type="number"
                                dataKey="z"
                                range={[50, 1000]}
                                name="価格"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Scatter
                                data={heatmapData}
                                fill="#8884d8"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};