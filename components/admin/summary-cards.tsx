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
  revenue: 'text-amber-500',
  orders: 'text-blue-500',
  products: 'text-emerald-500',
  'low-stock': 'text-red-500',
};

const bgColorMap: Record<string, string> = {
  revenue: 'bg-amber-50',
  orders: 'bg-blue-50',
  products: 'bg-emerald-50',
  'low-stock': 'bg-red-50',
};

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = iconMap[card.type] || Package;
        const colorClass = colorMap[card.type] || 'text-slate-600';
        const bgColorClass = bgColorMap[card.type] || 'bg-slate-50';
        const TrendIcon = card.trend > 0 ? TrendingUp : TrendingDown;
        const trendColor = card.trend > 0 ? 'text-emerald-600' : 'text-red-600';

        return (
          <Card key={idx} className="border-slate-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-3">{card.value}</p>
                  <p className="text-xs text-slate-500 mt-2">{card.subtitle}</p>
                </div>
                <div className={`${bgColorClass} rounded-lg p-3`}>
                  <Icon className={`w-6 h-6 ${colorClass}`} />
                </div>
              </div>
              {card.trend !== 0 && (
                <div className={`flex items-center mt-4 text-sm font-medium ${trendColor}`}>
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
