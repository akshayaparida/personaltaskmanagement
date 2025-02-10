import { Card } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface StatsCardProps {
    readonly title: string;
    readonly value: number;
    readonly trend: string;
    readonly icon?: LucideIcon;
}

export default function StatsCard({ title, value, trend, icon: Icon }: Readonly<StatsCardProps>) {
    const isPositive = trend.startsWith('+');
    
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {Icon && (
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold">{value}</h3>
                    </div>
                </div>
                <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    <span className="text-sm font-medium">{trend}</span>
                </div>
            </div>
        </Card>
    );
}