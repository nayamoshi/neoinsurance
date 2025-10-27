'use client';

import { TrendingUp } from 'lucide-react';
import { Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { date: '2024-05-01', score: 75 },
  { date: '2024-05-05', score: 78 },
  { date: '2024-05-10', score: 77 },
  { date: '2024-05-15', score: 81 },
  { date: '2024-05-20', score: 83 },
  { date: '2024-05-25', score: 82 },
  { date: '2024-05-30', score: 87 },
];

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
};

export function ReputationChart() {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Reputation Trend</CardTitle>
        <CardDescription>Your score over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[70, 90]}
             />
             <Tooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              dataKey="score"
              type="monotone"
              stroke="var(--color-score)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 4 points in the last 30 days{' '}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              May 01 - May 30, 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
