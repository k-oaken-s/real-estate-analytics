import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, ArrowRight } from "lucide-react";

interface Factor {
  name: string;
  impact: number;
  trend: 'up' | 'down' | 'stable';
  description?: string;
}

interface PriceFactorsAnalysisProps {
  factors: Factor[];
}

export const PriceFactorsAnalysis: React.FC<PriceFactorsAnalysisProps> = ({ factors }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact >= 5) return 'bg-blue-600';
    if (impact >= 3) return 'bg-blue-500';
    return 'bg-blue-400';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          価格変動要因分析
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {factors.map((factor) => (
            <div 
              key={factor.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{factor.name}</h3>
                  {getTrendIcon(factor.trend)}
                </div>
                {factor.description && (
                  <p className="text-sm text-gray-500 mt-1">{factor.description}</p>
                )}
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold">{factor.impact}%</div>
                    <div className="text-sm text-gray-500">影響度</div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-full rounded-full ${getImpactColor(factor.impact)}`}
                      style={{ width: `${Math.min(100, factor.impact * 10)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};