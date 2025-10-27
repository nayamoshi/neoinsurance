import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldAlert, Star, TrendingUp } from 'lucide-react';

const breakdownItems = [
  {
    title: 'Completed Coverages',
    value: '12',
    icon: CheckCircle,
    color: 'text-green-500',
  },
  {
    title: 'Disputes',
    value: '2',
    icon: ShieldAlert,
    color: 'text-yellow-500',
  },
  {
    title: 'Fair Outcomes',
    value: '95%',
    icon: TrendingUp,
    color: 'text-blue-500',
  },
  {
    title: 'Average Rating',
    value: '4.7 / 5.0',
    icon: Star,
    color: 'text-purple-500',
  },
];

export function ReputationBreakdown() {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Reputation Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {breakdownItems.map((item) => (
            <Card key={item.title} className="bg-muted/50">
              <CardContent className="flex items-center gap-4 p-6">
                <item.icon className={`h-8 w-8 ${item.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  <p className="text-xl font-bold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
