// components/dashboard/StatsCard.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';

export interface StatsCardProps {
  readonly title: string;
  readonly value: number | string;
  readonly icon?: string;
}

export function StatsCard({ title, value, icon }: Readonly<StatsCardProps>) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        {icon && <span className="text-gray-500">{icon}</span>}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </Card>
  );
}