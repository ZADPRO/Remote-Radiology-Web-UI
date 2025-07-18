"use client";

import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ImpressionModel } from "@/services/analyticsService";

export const description = "A pie chart with a label list";

interface RecoCodeCountPieProps {
  ImpressionModel: ImpressionModel[];
}

export function RecoCodeCountPie({ ImpressionModel }: RecoCodeCountPieProps) {
  const chartData = ImpressionModel.filter((item) => item.count > 0) // ✅ filter out zero-count items
    .map((item, index) => ({
      recocode: item.impression,
      visitors: item.count,
      fill: `var(--chart-${(index % 5) + 1})`,
    }));

  console.log(chartData);

  const chartConfig = ImpressionModel.reduce((acc, item, index) => {
    acc[item.impression] = {
      label: `${item.impression}(${item.count})`,
      color: `var(--chart-${(index % 5) + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="flex flex-col bg-[#F9F4ED]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Reco Code Count</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="h-[30vh]">No Reco Codes</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square h-[30vh]"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="recocode" hideLabel />}
              />
              <Pie data={chartData} dataKey="visitors">
                <LabelList
                  dataKey="recocode"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value: keyof typeof chartConfig) =>
                    chartConfig[value]?.label
                  }
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
