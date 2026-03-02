'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Package, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface SummaryCardsProps {
  cards: any[];
}

const iconMap: Record<string, any> = {
  revenue: DollarSign,
  orders: ShoppingCart,
  products: Package,
  'low-stock': AlertCircle,
};

const colorMap: Record<string, string> = {
  revenue: 'text-coffee-600',
  orders: 'text-blue-600',
  products: 'text-green-600',
  'low-stock': 'text-red-600',
};

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = iconMap[card.type] || Package;
        const colorClass = colorMap[card.type] || 'text-gray-600';
        const TrendIcon = card.trend > 0 ? TrendingUp : TrendingDown;
        const trendColor = card.trend > 0 ? 'text-green-600' : 'text-red-600';

        return (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold mt-2">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                </div>
                <Icon className={`w-8 h-8 ${colorClass}`} />
              </div>
              {card.trend !== 0 && (
                <div className={`flex items-center mt-4 text-sm ${trendColor}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  <span>{Math.abs(card.trend)}% vs yesterday</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
