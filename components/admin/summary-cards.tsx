'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SummaryCard } from '@/types';

interface SummaryCardsProps {
  cards: SummaryCard[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className="h-8 w-8">{card.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground pt-1">{card.subtitle}</p>
            {card.trend !== undefined && card.trend !== 0 && (
              <p className={`text-xs mt-2 ${card.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend > 0 ? '↑' : '↓'} {Math.abs(card.trend)}% from last period
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
