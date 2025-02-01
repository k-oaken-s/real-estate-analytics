'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyFilters as PropertyFiltersType } from "@/types/filters";
import { encodeFiltersToUrl } from '@/lib/urlParams';

interface PropertyFiltersProps {
    onFilterChange: (filters: PropertyFiltersType) => void;
    propertyCount: number;
    maxPrice: number;
    maxArea: number;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
    onFilterChange,
    propertyCount,
    maxPrice,
    maxArea,
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<PropertyFiltersType>({
        priceRange: {},
        buildingAge: {},
        area: {},
        propertyType: [],
    });

    const [priceRange, setPriceRange] = useState<number[]>([0, maxPrice]);
    const [areaRange, setAreaRange] = useState<number[]>([0, maxArea]);
    const [ageRange, setAgeRange] = useState<number[]>([0, 50]);

    const propertyTypes = ['マンション', '一戸建て', '土地'];

    useEffect(() => {
        setPriceRange([0, maxPrice]);
        setAreaRange([0, maxArea]);
    }, [maxPrice, maxArea]);

    const handleFilterChange = () => {
        const newFilters: PropertyFiltersType = {
            priceRange: { min: priceRange[0], max: priceRange[1] },
            area: { min: areaRange[0], max: areaRange[1] },
            buildingAge: { min: ageRange[0], max: ageRange[1] },
            propertyType: filters.propertyType,
        };

        // URLを更新
        const queryString = encodeFiltersToUrl(newFilters);
        router.push(`?${queryString}`, { scroll: false });

        onFilterChange(newFilters);
    };

    const handleReset = () => {
        setPriceRange([0, maxPrice]);
        setAreaRange([0, maxArea]);
        setAgeRange([0, 50]);
        setFilters({
            priceRange: {},
            buildingAge: {},
            area: {},
            propertyType: [],
        });

        router.push('/', { scroll: false });
        onFilterChange({
            priceRange: {},
            buildingAge: {},
            area: {},
            propertyType: [],
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>絞り込み検索</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                        リセット
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            価格帯: {priceRange[0].toLocaleString()} 〜 {priceRange[1].toLocaleString()}万円
                        </label>
                        <Slider
                            min={0}
                            max={maxPrice}
                            step={100}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            面積: {areaRange[0]} 〜 {areaRange[1]}㎡
                        </label>
                        <Slider
                            min={0}
                            max={maxArea}
                            step={1}
                            value={areaRange}
                            onValueChange={setAreaRange}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            築年数: {ageRange[0]} 〜 {ageRange[1]}年
                        </label>
                        <Slider
                            min={0}
                            max={50}
                            step={1}
                            value={ageRange}
                            onValueChange={setAgeRange}
                            className="py-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">物件タイプ</label>
                        <div className="grid grid-cols-2 gap-2">
                            {propertyTypes.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={type}
                                        checked={filters.propertyType?.includes(type)}
                                        onCheckedChange={(checked) => {
                                            setFilters(prev => ({
                                                ...prev,
                                                propertyType: checked
                                                    ? [...(prev.propertyType || []), type]
                                                    : prev.propertyType?.filter(t => t !== type) || []
                                            }));
                                        }}
                                    />
                                    <label
                                        htmlFor={type}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleFilterChange}
                        className="w-full"
                    >
                        {propertyCount}件の物件を表示
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};