'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AreaSelector } from "@/components/custom/AreaSelector";
import { StatsSummary } from "@/components/custom/StatsSummary";
import { PriceTrendChart } from "@/components/custom/PriceTrendChart";
import { PriceFactorsAnalysis } from "@/components/custom/PriceFactorsAnalysis";
import { PropertyMap } from "@/components/custom/PropertyMap";
import { DetailedStats } from "@/components/custom/DetailedStats";
import { PropertyFilters } from "@/components/custom/PropertyFilters";
import { SortSelect, type SortOption } from "@/components/custom/SortSelect";
import { fetchAreaAnalysis, fetchProperties, type AreaAnalysis, type Property } from "@/lib/api";
import { decodeFiltersFromUrl } from '@/lib/urlParams';
import { PropertyFilters as PropertyFiltersType } from "@/types/filters";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<AreaAnalysis | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('price-asc');

  useEffect(() => {
    // URLパラメータからフィルターを復元
    const filters = decodeFiltersFromUrl(searchParams.toString());
    if (Object.keys(filters).length > 0) {
      handleFilterChange(filters);
    }
  }, [searchParams]);

  const handleAreaChange = async (prefecture: string, city: string) => {
    setLoading(true);
    setError(null);

    try {
      const [analysis, propertiesData] = await Promise.all([
        fetchAreaAnalysis(prefecture, city),
        fetchProperties(prefecture, city),
      ]);

      setAreaData(analysis);
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
    } catch (err) {
      setError('データの取得に失敗しました。');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: PropertyFiltersType) => {
    const filtered = properties.filter(property => {
      const priceInRange =
        (!filters.priceRange.min || property.totalPrice >= filters.priceRange.min) &&
        (!filters.priceRange.max || property.totalPrice <= filters.priceRange.max);

      const areaInRange =
        (!filters.area.min || property.landArea >= filters.area.min) &&
        (!filters.area.max || property.landArea <= filters.area.max);

      const ageInRange =
        (!filters.buildingAge.min || property.buildingAge >= filters.buildingAge.min) &&
        (!filters.buildingAge.max || property.buildingAge <= filters.buildingAge.max);

      const typeMatches =
        !filters.propertyType?.length || filters.propertyType.includes(property.type);

      return priceInRange && areaInRange && ageInRange && typeMatches;
    });

    setFilteredProperties(filtered);
  };

  const sortProperties = (properties: Property[]) => {
    return [...properties].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.totalPrice - b.totalPrice;
        case 'price-desc':
          return b.totalPrice - a.totalPrice;
        case 'area-asc':
          return a.landArea - b.landArea;
        case 'area-desc':
          return b.landArea - a.landArea;
        case 'age-asc':
          return a.buildingAge - b.buildingAge;
        case 'age-desc':
          return b.buildingAge - a.buildingAge;
        default:
          return 0;
      }
    });
  };

  const sortedAndFilteredProperties = sortProperties(filteredProperties);

  // 価格トレンドデータの生成
  const trendData = properties.reduce((acc, property) => {
    const date = property.transactionDate.substring(0, 7); // YYYY-MM
    const existingData = acc.find(d => d.month === date);

    if (existingData) {
      existingData.totalPrice += property.totalPrice;
      existingData.count += 1;
      existingData.avgPrice = existingData.totalPrice / existingData.count;
    } else {
      acc.push({
        month: date,
        totalPrice: property.totalPrice,
        count: 1,
        avgPrice: property.totalPrice
      });
    }

    return acc;
  }, [] as Array<{ month: string; totalPrice: number; count: number; avgPrice: number }>)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(({ month, avgPrice }) => ({
      month,
      price: avgPrice
    }));

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">不動産市場分析</h1>

      <div className="space-y-8">
        <AreaSelector onAreaChange={handleAreaChange} />

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : areaData && properties.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <PropertyFilters
                onFilterChange={handleFilterChange}
                propertyCount={filteredProperties.length}
                maxPrice={Math.max(...properties.map(p => p.totalPrice))}
                maxArea={Math.max(...properties.map(p => p.landArea))}
              />
              <SortSelect
                value={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            <StatsSummary
              averagePrice={areaData.currentPrice}
              predictedPrice={areaData.predictedPrice}
              transactionCount={sortedAndFilteredProperties.length}
              priceChange={2.5}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PriceTrendChart data={trendData} />
              <PriceFactorsAnalysis factors={areaData.factors} />
            </div>

            <PropertyMap properties={sortedAndFilteredProperties} />
            <DetailedStats properties={sortedAndFilteredProperties} />
          </>
        )}
      </div>
    </main>
  );
}