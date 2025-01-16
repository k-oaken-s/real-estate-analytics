'use client';

import { AreaSelector } from "@/components/custom/AreaSelector";
import { StatsSummary } from "@/components/custom/StatsSummary";
import { PriceTrendChart } from "@/components/custom/PriceTrendChart";
import { PriceFactorsAnalysis } from "@/components/custom/PriceFactorsAnalysis";
import { getAreaAnalysis } from "@/lib/api";
import { AreaAnalysis } from "@/types/api";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AreaAnalysis | null>(null);

  const handleAreaChange = async (prefecture: string, city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAreaAnalysis(prefecture, city);
      setAnalysisData(data);
    } catch (err) {
      setError('データの取得に失敗しました。しばらく経ってから再度お試しください。');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        ) : analysisData && (
          <>
            <StatsSummary
              averagePrice={analysisData.currentPrice}
              predictedPrice={analysisData.predictedPrice}
              transactionCount={analysisData.transactionCount}
              priceChange={analysisData.priceChange}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PriceTrendChart data={analysisData.priceTrends} />
              <PriceFactorsAnalysis factors={analysisData.factors} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}