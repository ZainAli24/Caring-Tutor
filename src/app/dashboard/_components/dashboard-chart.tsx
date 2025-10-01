'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TestResult } from '@/lib/types';

interface DashboardChartProps {
  data: TestResult[];
}

const chartConfig = {
  score: {
    label: 'Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DashboardChart({ data }: DashboardChartProps) {
  const chartData = data.slice(0, 5).map(r => ({
    name: r.topic.substring(0, 15),
    score: r.score,
  })).reverse();

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="score" fill="var(--color-score)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
